import type { NextFunction, Request, Response } from "express";

import {
    updateClinic,
    createClinic,
    removeClinic,
    listClinics,
    findClinicById,
} from "../services/clinic.service.js";

/**
 * GET /api/clinics
 * Lists the active clinics. Any authenticated user can see them.
 */
export async function getClinics(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const clinics = await listClinics();

        res.status(200).json({
            message: "Clinics found.",
            total: clinics.length,
            clinics,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/clinics/:id
 * Returns a single clinic with the data of its manager.
 */
export async function getClinicById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // The id already comes validated as a UUID by validateParams.
        const id = req.params.id as string;

        const clinic = await findClinicById(id);

        res.status(200).json({
            message: "Clinic found.",
            clinic,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/clinics
 * Registers a new clinic. Only the admin can do it.
 */
export async function postClinic(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const clinic = await createClinic(req.body);

        res.status(201).json({
            message: "Clinic created successfully.",
            clinic,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/clinics/:id
 * Updates the data of a clinic. Only the admin.
 */
export async function putClinic(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const clinic = await updateClinic(id, req.body);

        res.status(200).json({
            message: "Clinic updated successfully.",
            clinic,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/clinics/:id
 * Logically deletes a clinic. Only the admin.
 */
export async function deleteClinic(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        await removeClinic(id);

        res.status(200).json({
            message: "Clinic deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
}
