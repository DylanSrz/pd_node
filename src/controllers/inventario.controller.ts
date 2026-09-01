import type { NextFunction, Request, Response } from "express";

import {
    actualizarInventario,
    crearInventario,
    eliminarInventario,
    listarInventario,
    obtenerInventarioPorId,
} from "../services/inventario.service.js";

/**
 * GET /api/inventario
 * Lista las existencias de todos los almacenes.
 */
export async function getInventario(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const inventario = await listarInventario();

        res.status(200).json({
            message: "Inventario encontrado.",
            total: inventario.length,
            inventario,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/inventario/:id
 * Devuelve un solo registro de inventario.
 */
export async function getInventarioPorId(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const registro = await obtenerInventarioPorId(id);

        res.status(200).json({
            message: "Registro de inventario encontrado.",
            inventario: registro,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/inventario
 * Registra las existencias de un medicamento en un almacén.
 * Solo el administrador.
 */
export async function postInventario(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const registro = await crearInventario(req.body);

        res.status(201).json({
            message: "Registro de inventario creado correctamente.",
            inventario: registro,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/inventario/:id
 * Cambia la cantidad disponible. Solo el administrador.
 */
export async function putInventario(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const registro = await actualizarInventario(id, req.body);

        res.status(200).json({
            message: "Inventario actualizado correctamente.",
            inventario: registro,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/inventario/:id
 * Elimina lógicamente un registro de inventario.
 * Solo el administrador.
 */
export async function deleteInventario(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        await eliminarInventario(id);

        res.status(200).json({
            message: "Registro de inventario eliminado correctamente.",
        });
    } catch (error) {
        next(error);
    }
}
