import type { NextFunction, Request, Response } from "express";

import { Almacen, Clinica, Medicamento } from "../models/index.js";

/**
 * Revisa que la clínica, el medicamento y el almacén que vienen
 * en el body existan y estén activos, antes de crear la solicitud.
 *
 * Sin esta revisión, PostgreSQL rechazaría la inserción por las
 * llaves foráneas, pero el mensaje de error sería técnico y no
 * diría cuál de los tres es el que está mal.
 */
export async function verificarEntidadesRelacionadas(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { clinica_id, medicamento_id, almacen_id } = req.body;

        // Se revisa la clínica.
        const clinica = await Clinica.findOne({
            where: { id: clinica_id, is_active: true },
        });

        if (!clinica) {
            res.status(404).json({
                message: "La clínica indicada no existe o fue eliminada.",
            });
            return;
        }

        // Se revisa el medicamento.
        const medicamento = await Medicamento.findOne({
            where: { id: medicamento_id, is_active: true },
        });

        if (!medicamento) {
            res.status(404).json({
                message: "El medicamento indicado no existe o fue eliminado.",
            });
            return;
        }

        // Se revisa el almacén.
        const almacen = await Almacen.findOne({
            where: { id: almacen_id, is_active: true },
        });

        if (!almacen) {
            res.status(404).json({
                message: "El almacén indicado no existe o fue eliminado.",
            });
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
}
