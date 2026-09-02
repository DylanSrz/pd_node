import type { NextFunction, Request, Response } from "express";

import { findInventoryRecord } from "../services/inventory.service.js";

/**
 * Prevents registering a request when the warehouse does not have
 * enough stock of the requested medication.
 *
 * It is one of the validations required by the statement.
 *
 * It runs after verifyRelatedEntities, so by this point it is already
 * known that the warehouse and the medication exist.
 */
export async function verifyAvailableInventory(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { warehouse_id, medication_id, requested_quantity } = req.body;

        const inventoryRecord = await findInventoryRecord(warehouse_id, medication_id);

        // The warehouse has never handled that medication.
        if (!inventoryRecord) {
            res.status(400).json({
                message: "The selected warehouse does not handle that medication.",
            });
            return;
        }

        // The warehouse does handle it, but it does not have enough units.
        if (inventoryRecord.quantity < requested_quantity) {
            res.status(400).json({
                message: "The warehouse does not have enough inventory of that medication.",
                requested_quantity: requested_quantity,
                available_quantity: inventoryRecord.quantity,
            });
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
}
