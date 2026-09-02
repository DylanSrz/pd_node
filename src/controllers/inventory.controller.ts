import type { NextFunction, Request, Response } from "express";

import {
    updateInventory,
    createInventory,
    removeInventory,
    listInventory,
    findInventoryById,
} from "../services/inventory.service.js";

/**
 * GET /api/inventory
 * Lists the stock of every warehouse.
 */
export async function getInventory(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const inventory = await listInventory();

        res.status(200).json({
            message: "Inventory found.",
            total: inventory.length,
            inventory,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/inventory/:id
 * Returns a single inventory record.
 */
export async function getInventoryById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const record = await findInventoryById(id);

        res.status(200).json({
            message: "Inventory record found.",
            inventory: record,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/inventory
 * Registers the stock of a medication in a warehouse.
 * Only the admin.
 */
export async function postInventory(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const record = await createInventory(req.body);

        res.status(201).json({
            message: "Inventory record created successfully.",
            inventory: record,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/inventory/:id
 * Changes the available quantity. Only the admin.
 */
export async function putInventory(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const record = await updateInventory(id, req.body);

        res.status(200).json({
            message: "Inventory updated successfully.",
            inventory: record,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/inventory/:id
 * Logically deletes an inventory record.
 * Only the admin.
 */
export async function deleteInventory(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        await removeInventory(id);

        res.status(200).json({
            message: "Inventory record deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
}
