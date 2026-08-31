import type { NextFunction, Request, Response } from "express";
import { UniqueConstraintError, ValidationError } from "sequelize";

import { HttpError } from "../utils/http-error.js";

/**
 * Middleware que atrapa todos los errores de la aplicación
 * y responde siempre con el mismo formato JSON.
 *
 * Va registrado al final de app.ts, después de todas las rutas.
 * Express sabe que es un manejador de errores porque recibe
 * cuatro parámetros y el primero es el error.
 */
export function errorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Caso 1: es un error de negocio que lanzamos nosotros,
    // así que ya trae su propio código HTTP.
    if (error instanceof HttpError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
    }

    // Caso 2: la base de datos rechazó un valor repetido
    // en una columna marcada como única.
    if (error instanceof UniqueConstraintError) {
        res.status(409).json({
            message: "Ya existe un registro con esos datos.",
            errors: error.errors.map((detalle) => detalle.message),
        });
        return;
    }

    // Caso 3: una validación del modelo de Sequelize falló.
    if (error instanceof ValidationError) {
        res.status(400).json({
            message: "Datos inválidos.",
            errors: error.errors.map((detalle) => detalle.message),
        });
        return;
    }

    // Caso 4: cualquier error que no esperábamos.
    // Se muestra en la consola del servidor para poder revisarlo,
    // pero al cliente solo se le devuelve un mensaje genérico.
    console.error("Error inesperado:", error);

    res.status(500).json({ message: "Error interno del servidor." });
}
