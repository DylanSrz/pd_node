import type { NextFunction, Request, Response } from "express";

import {
    actualizarSolicitud,
    cambiarEstadoSolicitud,
    crearSolicitud,
    eliminarSolicitud,
    listarHistorialSolicitudes,
    listarSolicitudesActivas,
    listarSolicitudesPorClinica,
    obtenerSolicitudPorId,
} from "../services/solicitud.service.js";
import { HttpError } from "../utils/http-error.js";

/**
 * GET /api/solicitudes
 * Lista las solicitudes en curso (pendientes y aprobadas).
 * Cualquier usuario autenticado puede consultarlas.
 */
export async function getSolicitudes(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const solicitudes = await listarSolicitudesActivas();

        res.status(200).json({
            message: "Solicitudes activas encontradas.",
            total: solicitudes.length,
            solicitudes,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/solicitudes/historial
 * Lista el historial completo de solicitudes, en cualquier estado.
 */
export async function getHistorialSolicitudes(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const solicitudes = await listarHistorialSolicitudes();

        res.status(200).json({
            message: "Historial de solicitudes encontrado.",
            total: solicitudes.length,
            solicitudes,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/clinicas/:id/solicitudes
 * Lista el historial de solicitudes de una clínica.
 */
export async function getSolicitudesPorClinica(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const clinicaId = req.params.id as string;

        const solicitudes = await listarSolicitudesPorClinica(clinicaId);

        res.status(200).json({
            message: "Historial de solicitudes de la clínica encontrado.",
            total: solicitudes.length,
            solicitudes,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/solicitudes/:id
 * Devuelve una sola solicitud con todos sus datos relacionados.
 */
export async function getSolicitudPorId(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const solicitud = await obtenerSolicitudPorId(id);

        res.status(200).json({
            message: "Solicitud encontrada.",
            solicitud,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/solicitudes
 * Registra una solicitud de abastecimiento.
 * La usan el gestor de solicitudes y el administrador.
 */
export async function postSolicitud(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // El usuario se toma del token, no del body, para que nadie
        // pueda registrar una solicitud a nombre de otra persona.
        const usuario = req.user;

        if (!usuario) {
            throw new HttpError(401, "Usuario no autenticado.");
        }

        const solicitud = await crearSolicitud(req.body, usuario.id);

        res.status(201).json({
            message: "Solicitud registrada correctamente.",
            solicitud,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PATCH /api/solicitudes/:id/estado
 * Cambia el estado de una solicitud existente.
 */
export async function patchEstadoSolicitud(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const solicitud = await cambiarEstadoSolicitud(id, req.body);

        res.status(200).json({
            message: `Estado de la solicitud actualizado a '${solicitud.estado}'.`,
            solicitud,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/solicitudes/:id
 * Corrige la cantidad o las observaciones. Solo el administrador.
 */
export async function putSolicitud(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const solicitud = await actualizarSolicitud(id, req.body);

        res.status(200).json({
            message: "Solicitud actualizada correctamente.",
            solicitud,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/solicitudes/:id
 * Elimina lógicamente una solicitud. Solo el administrador.
 */
export async function deleteSolicitud(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        await eliminarSolicitud(id);

        res.status(200).json({
            message: "Solicitud eliminada correctamente.",
        });
    } catch (error) {
        next(error);
    }
}
