import type { NextFunction, Request, Response } from "express";

import {
    updateWarehouse,
    createWarehouse,
    removeWarehouse,
    listWarehouses,
    findWarehouseById,
} from "../services/warehouse.service.js";

/**
 * GET /api/warehouses
 * Lists the active warehouses. Open to any authenticated user.
 */
export async function getWarehouses(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const warehouses = await listWarehouses();

        res.status(200).json({
            message: "Warehouses found.",
            total: warehouses.length,
            warehouses,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/warehouses/:id
 * Returns a single warehouse.
 */
export async function getWarehouseById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const warehouse = await findWarehouseById(id);

        res.status(200).json({
            message: "Warehouse found.",
            warehouse,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/warehouses
 * Registers a new warehouse. Only the admin.
 */
export async function postWarehouse(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const warehouse = await createWarehouse(req.body);

        res.status(201).json({
            message: "Warehouse created successfully.",
            warehouse,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/warehouses/:id
 * Updates a warehouse. Only the admin.
 */
export async function putWarehouse(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const warehouse = await updateWarehouse(id, req.body);

        res.status(200).json({
            message: "Warehouse updated successfully.",
            warehouse,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/warehouses/:id
 * Logically deletes a warehouse. Only the admin.
 */
export async function deleteWarehouse(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        await removeWarehouse(id);

        res.status(200).json({
            message: "Warehouse deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
}
