import type { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";

import { Clinic } from "../models/index.js";

/**
 * Prevents registering two clinics with the same tax id.
 *
 * It works both when creating and when updating:
 * - When creating there is no :id in the route, so any clinic that
 *   already has that tax id is looked up.
 * - When updating there is an :id, and the clinic itself is excluded
 *   from the search so it is not rejected by its own value.
 *
 * The search does not filter by is_active on purpose: even if a clinic
 * is logically deleted, its tax id is still taken in the database.
 */
export async function verifyUniqueTaxId(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const taxId = req.body.tax_id;

        // On an update the tax id is optional. If it was not sent,
        // there is nothing to check.
        if (!taxId) {
            next();
            return;
        }

        const currentId = req.params.id;

        // Base condition: look for a clinic with that tax id.
        const conditions: Record<string, unknown> = { tax_id: taxId };

        // If we are updating, the clinic being edited is discarded.
        // Op.ne means "not equal".
        if (currentId) {
            conditions.id = { [Op.ne]: currentId };
        }

        const clinicWithSameTaxId = await Clinic.findOne({ where: conditions });

        if (clinicWithSameTaxId) {
            res.status(409).json({
                message: `A clinic registered with the tax id ${taxId} already exists.`,
            });
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
}
