import { z } from "zod";

/**
 * Rules the body of POST /api/medications must meet.
 *
 * The text inside z.string({ error: ... }) is the message
 * shown when the field is missing or comes with another type.
 * The .min() and .max() messages apply when it is indeed text
 * but has a wrong length.
 */
export const createMedicationSchema = z.object({
    name: z
        .string({ error: "The name is required and must be text." })
        .min(3, "The name must have at least 3 characters.")
        .max(150, "The name cannot exceed 150 characters."),

    description: z
        .string({ error: "The description is required and must be text." })
        .min(5, "The description must have at least 5 characters.")
        .max(255, "The description cannot exceed 255 characters."),

    presentation: z
        .string({ error: "The presentation is required and must be text." })
        .min(3, "The presentation must have at least 3 characters.")
        .max(100, "The presentation cannot exceed 100 characters."),

    laboratory: z
        .string({ error: "The laboratory is required and must be text." })
        .min(3, "The laboratory must have at least 3 characters.")
        .max(150, "The laboratory cannot exceed 150 characters."),
});

/**
 * Rules of the body of PUT /api/medications/:id.
 */
export const updateMedicationSchema = createMedicationSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be sent in order to update.",
    });

export type CreateMedicationInput = z.infer<typeof createMedicationSchema>;
export type UpdateMedicationInput = z.infer<typeof updateMedicationSchema>;
