import type { NextFunction, Request, Response } from "express";

import {
    actualizarMedicamento,
    crearMedicamento,
    eliminarMedicamento,
    listarMedicamentos,
    obtenerMedicamentoPorId,
} from "../services/medicamento.service.js";

/**
 * GET /api/medicamentos
 * Lista el catálogo de medicamentos activos.
 */
export async function getMedicamentos(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const medicamentos = await listarMedicamentos();

        res.status(200).json({
            message: "Medicamentos encontrados.",
            total: medicamentos.length,
            medicamentos,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/medicamentos/:id
 * Devuelve un solo medicamento.
 */
export async function getMedicamentoPorId(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const medicamento = await obtenerMedicamentoPorId(id);

        res.status(200).json({
            message: "Medicamento encontrado.",
            medicamento,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/medicamentos
 * Registra un medicamento nuevo. Solo el administrador.
 */
export async function postMedicamento(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const medicamento = await crearMedicamento(req.body);

        res.status(201).json({
            message: "Medicamento creado correctamente.",
            medicamento,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/medicamentos/:id
 * Actualiza un medicamento. Solo el administrador.
 */
export async function putMedicamento(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const medicamento = await actualizarMedicamento(id, req.body);

        res.status(200).json({
            message: "Medicamento actualizado correctamente.",
            medicamento,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/medicamentos/:id
 * Elimina lógicamente un medicamento. Solo el administrador.
 */
export async function deleteMedicamento(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        await eliminarMedicamento(id);

        res.status(200).json({
            message: "Medicamento eliminado correctamente.",
        });
    } catch (error) {
        next(error);
    }
}
