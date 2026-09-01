import type { NextFunction, Request, Response } from "express";

import { buscarInventario } from "../services/inventario.service.js";

/**
 * Impide registrar una solicitud cuando el almacén no tiene
 * existencias suficientes del medicamento pedido.
 *
 * Es una de las validaciones que exige el enunciado.
 *
 * Se ejecuta después de verificarEntidadesRelacionadas, así que
 * a esta altura ya se sabe que el almacén y el medicamento existen.
 */
export async function verificarInventarioDisponible(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { almacen_id, medicamento_id, cantidad_solicitada } = req.body;

        const registroInventario = await buscarInventario(almacen_id, medicamento_id);

        // El almacén nunca ha manejado ese medicamento.
        if (!registroInventario) {
            res.status(400).json({
                message: "El almacén seleccionado no maneja ese medicamento.",
            });
            return;
        }

        // El almacén sí lo maneja, pero no tiene suficientes unidades.
        if (registroInventario.cantidad < cantidad_solicitada) {
            res.status(400).json({
                message: "El almacén no tiene inventario suficiente de ese medicamento.",
                cantidad_solicitada: cantidad_solicitada,
                cantidad_disponible: registroInventario.cantidad,
            });
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
}
