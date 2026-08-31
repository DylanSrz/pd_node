import { z } from "zod";

import { ROLES_USUARIO } from "../types/enums.js";

/**
 * Reglas que debe cumplir el body de POST /api/auth/register.
 *
 * Este endpoint no pide token: el enunciado indica que el usuario
 * elige con qué rol se registra, y aquí solo se validan los datos.
 */
export const registerSchema = z.object({
    first_name: z
        .string({ error: "El nombre es obligatorio y debe ser texto." })
        .min(3, "El nombre debe tener al menos 3 caracteres.")
        .max(100, "El nombre no puede superar los 100 caracteres."),

    last_name: z
        .string({ error: "El apellido es obligatorio y debe ser texto." })
        .min(3, "El apellido debe tener al menos 3 caracteres.")
        .max(100, "El apellido no puede superar los 100 caracteres."),

    email: z.email("El correo electrónico no tiene un formato válido."),

    password: z
        .string({ error: "La contraseña es obligatoria y debe ser texto." })
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .max(64, "La contraseña no puede superar los 64 caracteres."),

    // Solo se aceptan los roles definidos en ROLES_USUARIO.
    role: z.enum(ROLES_USUARIO, {
        message: "El rol debe ser 'administrador' o 'gestor'.",
    }),
});

/**
 * Reglas que debe cumplir el body de POST /api/auth/login.
 */
export const loginSchema = z.object({
    email: z.email("El correo electrónico no tiene un formato válido."),

    password: z
        .string({ error: "La contraseña es obligatoria y debe ser texto." })
        .min(1, "La contraseña es obligatoria."),
});

// Tipos que salen de los esquemas, para usarlos en los services
// sin tener que escribir los campos otra vez.
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
