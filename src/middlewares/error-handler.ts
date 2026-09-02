import type { NextFunction, Request, Response } from "express";
import { UniqueConstraintError, ValidationError } from "sequelize";

import { HttpError } from "../utils/http-error.js";

/**
 * Middleware that catches every error of the application
 * and always answers with the same JSON format.
 *
 * It is registered at the end of app.ts, after every route.
 * Express knows it is an error handler because it receives
 * four parameters and the first one is the error.
 */
export function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Case 1: it is a business error thrown by us,
    // so it already carries its own HTTP code.
    if (error instanceof HttpError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
    }

    // Case 2: the database rejected a repeated value
    // in a column marked as unique.
    if (error instanceof UniqueConstraintError) {
        res.status(409).json({
            message: "A record with that data already exists.",
            errors: error.errors.map((detail) => detail.message),
        });
        return;
    }

    // Case 3: a validation of the Sequelize model failed.
    if (error instanceof ValidationError) {
        res.status(400).json({
            message: "Invalid data.",
            errors: error.errors.map((detail) => detail.message),
        });
        return;
    }

    // Case 4: any error we were not expecting.
    // It is printed in the server console so it can be reviewed,
    // but the client only gets a generic message back.
    console.error("Unexpected error:", error);

    res.status(500).json({ message: "Internal server error." });
}
