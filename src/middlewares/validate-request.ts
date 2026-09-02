import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

/**
 * Validates the body of the request against a Zod schema.
 *
 * If the data is wrong, it stops the request with a 400 and the list
 * of errors. If it is fine, it replaces req.body with the data already
 * validated and converted to the right type.
 *
 * @param schema Zod schema defined in the dto folder.
 */
export function validateRequest(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction): void => {
        // safeParse does not throw an exception: it returns an object
        // telling whether the validation went well or not.
        const result = schema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                message: "Invalid or incomplete data.",
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    detail: issue.message,
                })),
            });
            return;
        }

        req.body = result.data;

        next();
    };
}

/**
 * Validates the route parameters (for example the :id of /clinics/:id).
 *
 * It is useful to reject right away an id that does not have UUID
 * format, before going to ask the database.
 *
 * @param schema Zod schema defined in the dto folder.
 */
export function validateParams(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.params);

        if (!result.success) {
            res.status(400).json({
                message: "Invalid route parameters.",
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    detail: issue.message,
                })),
            });
            return;
        }

        next();
    };
}
