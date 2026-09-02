import type { NextFunction, Request, Response } from "express";

import {
    updateRequest,
    changeRequestStatus,
    createRequest,
    removeRequest,
    listRequestHistory,
    listActiveRequests,
    listRequestsByClinic,
    findRequestById,
} from "../services/request.service.js";
import { HttpError } from "../utils/http-error.js";

/**
 * GET /api/requests
 * Lists the requests in progress (pending and approved).
 * Any authenticated user can query them.
 */
export async function getRequests(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const requests = await listActiveRequests();

        res.status(200).json({
            message: "Active requests found.",
            total: requests.length,
            requests,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/requests/history
 * Lists the full history of requests, in any status.
 */
export async function getRequestHistory(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const requests = await listRequestHistory();

        res.status(200).json({
            message: "Request history found.",
            total: requests.length,
            requests,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/clinics/:id/requests
 * Lists the request history of a clinic.
 */
export async function getRequestsByClinic(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const clinicId = req.params.id as string;

        const requests = await listRequestsByClinic(clinicId);

        res.status(200).json({
            message: "Request history of the clinic found.",
            total: requests.length,
            requests,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/requests/:id
 * Returns a single request with all its related data.
 */
export async function getRequestById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const supplyRequest = await findRequestById(id);

        res.status(200).json({
            message: "Request found.",
            request: supplyRequest,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/requests
 * Registers a supply request.
 * Used by the request manager and by the admin.
 */
export async function postRequest(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // The user is taken from the token, not from the body, so that
        // nobody can register a request on behalf of another person.
        const user = req.user;

        if (!user) {
            throw new HttpError(401, "User not authenticated.");
        }

        const supplyRequest = await createRequest(req.body, user.id);

        res.status(201).json({
            message: "Request registered successfully.",
            request: supplyRequest,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PATCH /api/requests/:id/status
 * Changes the status of an existing request.
 */
export async function patchRequestStatus(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const supplyRequest = await changeRequestStatus(id, req.body);

        res.status(200).json({
            message: `Request status updated to '${supplyRequest.status}'.`,
            request: supplyRequest,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/requests/:id
 * Fixes the quantity or the notes. Only the admin.
 */
export async function putRequest(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        const supplyRequest = await updateRequest(id, req.body);

        res.status(200).json({
            message: "Request updated successfully.",
            request: supplyRequest,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/requests/:id
 * Logically deletes a request. Only the admin.
 */
export async function deleteRequest(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = req.params.id as string;

        await removeRequest(id);

        res.status(200).json({
            message: "Request deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
}
