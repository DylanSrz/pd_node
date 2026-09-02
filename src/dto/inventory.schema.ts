import { z } from "zod";

/**
 * Rules the body of POST /api/inventory must meet.
 *
 * An inventory record tells how many units of a medication
 * there are in a specific warehouse.
 */
export const createInventorySchema = z.object({
    warehouse_id: z.uuid("The warehouse_id is required and must have UUID format."),

    medication_id: z.uuid("The medication_id is required and must have UUID format."),

    quantity: z
        .number({ error: "The quantity is required and must be a number." })
        .int("The quantity must be an integer.")
        .min(0, "The quantity cannot be negative."),
});

/**
 * Rules of the body of PUT /api/inventory/:id.
 *
 * Only the quantity can be changed: the warehouse and the medication
 * are the ones that identify the record, and changing them would be
 * the same as creating a different one.
 */
export const updateInventorySchema = z.object({
    quantity: z
        .number({ error: "The quantity is required and must be a number." })
        .int("The quantity must be an integer.")
        .min(0, "The quantity cannot be negative."),
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
