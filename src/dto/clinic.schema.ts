import { z } from "zod";

/**
 * Rules the body of POST /api/clinics must meet.
 * Every field is required when creating a clinic.
 *
 * The text inside z.string({ error: ... }) is the message
 * shown when the field is missing or comes with another type.
 * The .min() and .max() messages apply when it is indeed text
 * but has a wrong length.
 */
export const createClinicSchema = z.object({
    name: z
        .string({ error: "The name is required and must be text." })
        .min(3, "The name must have at least 3 characters.")
        .max(150, "The name cannot exceed 150 characters."),

    tax_id: z
        .string({ error: "The tax id is required and must be text." })
        .min(5, "The tax id must have at least 5 characters.")
        .max(20, "The tax id cannot exceed 20 characters."),

    address: z
        .string({ error: "The address is required and must be text." })
        .min(5, "The address must have at least 5 characters.")
        .max(200, "The address cannot exceed 200 characters."),

    phone: z
        .string({ error: "The phone is required and must be text." })
        .min(7, "The phone must have at least 7 characters.")
        .max(20, "The phone cannot exceed 20 characters."),

    email: z.email("The clinic email does not have a valid format."),

    manager_name: z
        .string({ error: "The manager name is required and must be text." })
        .min(3, "The manager name must have at least 3 characters.")
        .max(150, "The manager name cannot exceed 150 characters."),

    manager_email: z.email("The manager email does not have a valid format."),

    manager_phone: z
        .string({ error: "The manager phone is required and must be text." })
        .min(7, "The manager phone must have at least 7 characters.")
        .max(20, "The manager phone cannot exceed 20 characters."),
});

/**
 * Rules the body of PUT /api/clinics/:id must meet.
 *
 * .partial() turns every field of the create schema optional,
 * because when updating only what needs to change can be sent.
 * Even so, the field that is sent must meet its own rule.
 */
export const updateClinicSchema = createClinicSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be sent in order to update.",
    });

// Types coming out of the schemas, to use them in the service.
export type CreateClinicInput = z.infer<typeof createClinicSchema>;
export type UpdateClinicInput = z.infer<typeof updateClinicSchema>;
