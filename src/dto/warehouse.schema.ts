import { z } from "zod";

/**
 * Rules the body of POST /api/warehouses must meet.
 *
 * The text inside z.string({ error: ... }) is the message
 * shown when the field is missing or comes with another type.
 */
export const createWarehouseSchema = z.object({
    name: z
        .string({ error: "The name is required and must be text." })
        .min(3, "The name must have at least 3 characters.")
        .max(150, "The name cannot exceed 150 characters."),

    address: z
        .string({ error: "The address is required and must be text." })
        .min(5, "The address must have at least 5 characters.")
        .max(200, "The address cannot exceed 200 characters."),

    phone: z
        .string({ error: "The phone is required and must be text." })
        .min(7, "The phone must have at least 7 characters.")
        .max(20, "The phone cannot exceed 20 characters."),
});

/**
 * Rules of the body of PUT /api/warehouses/:id.
 *
 * .partial() turns every field optional, because when updating
 * only what needs to change can be sent.
 */
export const updateWarehouseSchema = createWarehouseSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be sent in order to update.",
    });

export type CreateWarehouseInput = z.infer<typeof createWarehouseSchema>;
export type UpdateWarehouseInput = z.infer<typeof updateWarehouseSchema>;
