import type { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";

import { Clinica } from "../models/index.js";

/**
 * Impide registrar dos clínicas con el mismo NIT.
 *
 * Funciona tanto al crear como al actualizar:
 * - Al crear no hay :id en la ruta, así que se busca cualquier clínica
 *   que ya tenga ese NIT.
 * - Al actualizar sí hay :id, y se excluye la propia clínica de la
 *   búsqueda para que no se rechace a sí misma.
 *
 * La búsqueda no filtra por is_active a propósito: aunque una clínica
 * esté eliminada lógicamente, su NIT sigue ocupado en la base de datos.
 */
export async function verificarNitUnico(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const nit = req.body.nit;

        // En una actualización el NIT es opcional. Si no lo mandaron,
        // no hay nada que revisar.
        if (!nit) {
            next();
            return;
        }

        const idActual = req.params.id;

        // Condición base: buscar una clínica con ese NIT.
        const condiciones: Record<string, unknown> = { nit };

        // Si estamos actualizando, se descarta la clínica que se edita.
        // Op.ne significa "not equal" (distinto de).
        if (idActual) {
            condiciones.id = { [Op.ne]: idActual };
        }

        const clinicaConMismoNit = await Clinica.findOne({ where: condiciones });

        if (clinicaConMismoNit) {
            res.status(409).json({
                message: `Ya existe una clínica registrada con el NIT ${nit}.`,
            });
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
}
