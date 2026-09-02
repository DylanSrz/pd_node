import type { NextFunction, Request, Response } from "express";

import { Request as SupplyRequest } from "../models/index.js";
import {
    isValidTransition,
    possibleStatusesAsText,
} from "../utils/request-status.js";

/**
 * Prevents updating a request to a status that is not allowed.
 *
 * It is one of the validations required by the statement. The rule is
 * not only that the status exists, but that the jump makes sense: for
 * example, a pending request cannot go straight to delivered
 * without having been approved first.
 */
export async function verifyStatusTransition(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;
        const newStatus = req.body.status;

        const supplyRequest = await SupplyRequest.findOne({
            where: { id, is_active: true },
        });

        if (!supplyRequest) {
            res.status(404).json({
                message: "The request does not exist or was deleted.",
            });
            return;
        }

        // It makes no sense to change a request to the status it already has.
        if (supplyRequest.status === newStatus) {
            res.status(400).json({
                message: `The request is already in the '${newStatus}' status.`,
            });
            return;
        }

        // The map of allowed transitions is checked.
        if (!isValidTransition(supplyRequest.status, newStatus)) {
            res.status(400).json({
                message: `It is not possible to go from '${supplyRequest.status}' to '${newStatus}'.`,
                current_status: supplyRequest.status,
                allowed_statuses: possibleStatusesAsText(supplyRequest.status),
            });
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
}
