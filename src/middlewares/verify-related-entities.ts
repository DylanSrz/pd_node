import type { NextFunction, Request, Response } from "express";

import { Warehouse, Clinic, Medication } from "../models/index.js";

/**
 * Checks that the clinic, the medication and the warehouse coming
 * in the body exist and are active, before creating the request.
 *
 * Without this check, PostgreSQL would reject the insert because of
 * the foreign keys, but the error message would be technical and would
 * not say which one of the three is the wrong one.
 */
export async function verifyRelatedEntities(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { clinic_id, medication_id, warehouse_id } = req.body;

        // The clinic is checked.
        const clinic = await Clinic.findOne({
            where: { id: clinic_id, is_active: true },
        });

        if (!clinic) {
            res.status(404).json({
                message: "The given clinic does not exist or was deleted.",
            });
            return;
        }

        // The medication is checked.
        const medication = await Medication.findOne({
            where: { id: medication_id, is_active: true },
        });

        if (!medication) {
            res.status(404).json({
                message: "The given medication does not exist or was deleted.",
            });
            return;
        }

        // The warehouse is checked.
        const warehouse = await Warehouse.findOne({
            where: { id: warehouse_id, is_active: true },
        });

        if (!warehouse) {
            res.status(404).json({
                message: "The given warehouse does not exist or was deleted.",
            });
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
}
