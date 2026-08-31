import type { NextFunction, Request, Response } from "express";

import {
    actualizarClinica,
    crearClinica,
    eliminarClinica,
    listarClinicas,
    obtenerClinicaPorId,
} from "../services/clinica.service.js";

/**
 * GET /api/clinicas
 * Lista las clínicas activas. Cualquier usuario autenticado puede verlas.
 */
export async function getClinicas(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const clinicas = await listarClinicas();

        res.status(200).json({
            message: "Clínicas encontradas.",
            total: clinicas.length,
            clinicas,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/clinicas/:id
 * Devuelve una sola clínica con los datos de su responsable.
 */
export async function getClinicaPorId(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // El id ya viene validado como UUID por validateParams.
        const id = req.params.id as string;

        const clinica = await obtenerClinicaPorId(id);

        res.status(200).json({
            message: "Clínica encontrada.",
            clinica,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/clinicas
 * Registra una clínica nueva. Solo el administrador puede hacerlo.
 */
export async function postClinica(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const clinica = await crearClinica(req.body);

        res.status(201).json({
            message: "Clínica creada correctamente.",
            clinica,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/clinicas/:id
 * Actualiza los datos de una clínica. Solo el administrador.
 */
export async function putClinica(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const clinica = await actualizarClinica(id, req.body);

        res.status(200).json({
            message: "Clínica actualizada correctamente.",
            clinica,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/clinicas/:id
 * Elimina lógicamente una clínica. Solo el administrador.
 */
export async function deleteClinica(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        await eliminarClinica(id);

        res.status(200).json({
            message: "Clínica eliminada correctamente.",
        });
    } catch (error) {
        next(error);
    }
}
