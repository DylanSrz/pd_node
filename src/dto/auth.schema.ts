import { z } from "zod";

import { USER_ROLES } from "../types/enums.js";

/**
 * Rules the body of POST /api/auth/register must meet.
 *
 * This endpoint does not ask for a token: the statement says the user
 * chooses which role to sign up with, and here only the data is validated.
 */
export const registerSchema = z.object({
    first_name: z
        .string({ error: "The first name is required and must be text." })
        .min(3, "The first name must have at least 3 characters.")
        .max(100, "The first name cannot exceed 100 characters."),

    last_name: z
        .string({ error: "The last name is required and must be text." })
        .min(3, "The last name must have at least 3 characters.")
        .max(100, "The last name cannot exceed 100 characters."),

    email: z.email("The email address does not have a valid format."),

    password: z
        .string({ error: "The password is required and must be text." })
        .min(8, "The password must have at least 8 characters.")
        .max(64, "The password cannot exceed 64 characters."),

    // Only the roles defined in USER_ROLES are accepted.
    role: z.enum(USER_ROLES, {
        message: "The role must be 'admin' or 'manager'.",
    }),
});

/**
 * Rules the body of POST /api/auth/login must meet.
 */
export const loginSchema = z.object({
    email: z.email("The email address does not have a valid format."),

    password: z
        .string({ error: "The password is required and must be text." })
        .min(1, "The password is required."),
});

// Types coming out of the schemas, to use them in the services
// without having to write the fields again.
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
