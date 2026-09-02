import { z } from "zod";

import { REQUEST_STATUSES } from "../types/enums.js";

/**
 * Rules the body of POST /api/requests must meet.
 *
 * The user_id is not asked for: it is taken from the token, so that
 * nobody can register a request on behalf of another person.
 *
 * The status is not asked for either: every request is born "pending".
 */
export const createRequestSchema = z.object({
    clinic_id: z.uuid("The clinic_id is required and must have UUID format."),

    medication_id: z.uuid("The medication_id is required and must have UUID format."),

    warehouse_id: z.uuid("The warehouse_id is required and must have UUID format."),

    requested_quantity: z
        .number({ error: "The requested quantity is required and must be a number." })
        .int("The requested quantity must be an integer.")
        .positive("The requested quantity must be greater than zero."),

    notes: z
        .string()
        .max(500, "The notes cannot exceed 500 characters.")
        .optional(),
});

/**
 * Rules of the body of PATCH /api/requests/:id/status.
 *
 * Only a status from the REQUEST_STATUSES list is accepted.
 * Whether the change is valid given the current status is checked
 * afterwards by the verifyStatusTransition middleware.
 */
export const changeStatusSchema = z.object({
    status: z.enum(REQUEST_STATUSES, {
        message: `The status must be one of: ${REQUEST_STATUSES.join(", ")}.`,
    }),

    notes: z
        .string()
        .max(500, "The notes cannot exceed 500 characters.")
        .optional(),
});

/**
 * Rules of the body of PUT /api/requests/:id.
 *
 * The admin can only fix the quantity and the notes,
 * and only while the request is still pending. The clinic, the
 * medication and the warehouse are not changed: for that the
 * request is voided and a new one is created.
 */
export const updateRequestSchema = z
    .object({
        requested_quantity: z
            .number({ error: "The requested quantity must be a number." })
            .int("The requested quantity must be an integer.")
            .positive("The requested quantity must be greater than zero.")
            .optional(),

        notes: z
            .string()
            .max(500, "The notes cannot exceed 500 characters.")
            .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be sent in order to update.",
    });

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type ChangeStatusInput = z.infer<typeof changeStatusSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
