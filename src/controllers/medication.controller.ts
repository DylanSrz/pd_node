import type { NextFunction, Request, Response } from "express";

import {
    updateMedication,
    createMedication,
    removeMedication,
    listMedications,
    findMedicationById,
} from "../services/medication.service.js";

/**
 * GET /api/medications
 * Lists the catalog of active medications.
 */
export async function getMedications(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const medications = await listMedications();

        res.status(200).json({
            message: "Medications found.",
            total: medications.length,
            medications,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/medications/:id
 * Returns a single medication.
 */
export async function getMedicationById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const medication = await findMedicationById(id);

        res.status(200).json({
            message: "Medication found.",
            medication,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/medications
 * Registers a new medication. Only the admin.
 */
export async function postMedication(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const medication = await createMedication(req.body);

        res.status(201).json({
            message: "Medication created successfully.",
            medication,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/medications/:id
 * Updates a medication. Only the admin.
 */
export async function putMedication(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const medication = await updateMedication(id, req.body);

        res.status(200).json({
            message: "Medication updated successfully.",
            medication,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/medications/:id
 * Logically deletes a medication. Only the admin.
 */
export async function deleteMedication(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        await removeMedication(id);

        res.status(200).json({
            message: "Medication deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
}
