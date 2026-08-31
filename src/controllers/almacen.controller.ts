import type { NextFunction, Request, Response } from "express";

import {
    actualizarAlmacen,
    crearAlmacen,
    eliminarAlmacen,
    listarAlmacenes,
    obtenerAlmacenPorId,
} from "../services/almacen.service.js";

/**
 * GET /api/almacenes
 * Lista los almacenes activos. Abierto a cualquier usuario autenticado.
 */
export async function getAlmacenes(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const almacenes = await listarAlmacenes();

        res.status(200).json({
            message: "Almacenes encontrados.",
            total: almacenes.length,
            almacenes,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/almacenes/:id
 * Devuelve un solo almacén.
 */
export async function getAlmacenPorId(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const almacen = await obtenerAlmacenPorId(id);

        res.status(200).json({
            message: "Almacén encontrado.",
            almacen,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/almacenes
 * Registra un almacén nuevo. Solo el administrador.
 */
export async function postAlmacen(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const almacen = await crearAlmacen(req.body);

        res.status(201).json({
            message: "Almacén creado correctamente.",
            almacen,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/almacenes/:id
 * Actualiza un almacén. Solo el administrador.
 */
export async function putAlmacen(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const almacen = await actualizarAlmacen(id, req.body);

        res.status(200).json({
            message: "Almacén actualizado correctamente.",
            almacen,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/almacenes/:id
 * Elimina lógicamente un almacén. Solo el administrador.
 */
export async function deleteAlmacen(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        await eliminarAlmacen(id);

        res.status(200).json({
            message: "Almacén eliminado correctamente.",
        });
    } catch (error) {
        next(error);
    }
}
