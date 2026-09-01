import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

/**
 * Valida el body de la petición contra un esquema de Zod.
 *
 * Si los datos están mal, corta la petición con un 400 y la lista
 * de errores. Si están bien, reemplaza req.body por los datos ya
 * validados y convertidos al tipo correcto.
 *
 * @param schema Esquema de Zod definido en la carpeta dto.
 */
export function validateRequest(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction): void => {
        // safeParse no lanza excepción: devuelve un objeto que dice
        // si la validación salió bien o mal.
        const resultado = schema.safeParse(req.body);

        if (!resultado.success) {
            res.status(400).json({
                message: "Datos inválidos o incompletos.",
                errors: resultado.error.issues.map((issue) => ({
                    campo: issue.path.join("."),
                    detalle: issue.message,
                })),
            });
            return;
        }

        req.body = resultado.data;

        next();
    };
}

/**
 * Valida los parámetros de la ruta (por ejemplo el :id de /clinicas/:id).
 *
 * Sirve para rechazar de una vez un id que no tenga formato UUID,
 * antes de ir a preguntarle a la base de datos.
 *
 * @param schema Esquema de Zod definido en la carpeta dto.
 */
export function validateParams(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const resultado = schema.safeParse(req.params);

        if (!resultado.success) {
            res.status(400).json({
                message: "Parámetros de ruta inválidos.",
                errors: resultado.error.issues.map((issue) => ({
                    campo: issue.path.join("."),
                    detalle: issue.message,
                })),
            });
            return;
        }

        next();
    };
}
