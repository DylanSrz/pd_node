import type { NextFunction, Request, Response } from "express";

import { Solicitud } from "../models/index.js";
import {
    esTransicionValida,
    estadosPosiblesComoTexto,
} from "../utils/estado-solicitud.js";

/**
 * Impide actualizar una solicitud a un estado no permitido.
 *
 * Es una de las validaciones que exige el enunciado. La regla no es
 * solo que el estado exista, sino que el salto tenga sentido: por
 * ejemplo, una solicitud pendiente no puede pasar directo a entregada
 * sin haber sido aprobada antes.
 */
export async function verificarTransicionEstado(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;
        const estadoNuevo = req.body.estado;

        const solicitud = await Solicitud.findOne({
            where: { id, is_active: true },
        });

        if (!solicitud) {
            res.status(404).json({
                message: "La solicitud no existe o fue eliminada.",
            });
            return;
        }

        // No tiene sentido cambiar una solicitud al estado que ya tiene.
        if (solicitud.estado === estadoNuevo) {
            res.status(400).json({
                message: `La solicitud ya se encuentra en estado '${estadoNuevo}'.`,
            });
            return;
        }

        // Se consulta el mapa de transiciones permitidas.
        if (!esTransicionValida(solicitud.estado, estadoNuevo)) {
            res.status(400).json({
                message: `No se puede pasar de '${solicitud.estado}' a '${estadoNuevo}'.`,
                estado_actual: solicitud.estado,
                estados_permitidos: estadosPosiblesComoTexto(solicitud.estado),
            });
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
}
