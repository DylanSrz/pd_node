import { z } from "zod";

import { ESTADOS_SOLICITUD } from "../types/enums.js";

/**
 * Reglas que debe cumplir el body de POST /api/solicitudes.
 *
 * No se pide el usuario_id: ese se saca del token, para que nadie
 * pueda registrar una solicitud a nombre de otra persona.
 *
 * El estado tampoco se pide: toda solicitud nace en "pendiente".
 */
export const crearSolicitudSchema = z.object({
    clinica_id: z.uuid("El clinica_id es obligatorio y debe tener formato UUID."),

    medicamento_id: z.uuid("El medicamento_id es obligatorio y debe tener formato UUID."),

    almacen_id: z.uuid("El almacen_id es obligatorio y debe tener formato UUID."),

    cantidad_solicitada: z
        .number({ error: "La cantidad solicitada es obligatoria y debe ser un número." })
        .int("La cantidad solicitada debe ser un número entero.")
        .positive("La cantidad solicitada debe ser mayor que cero."),

    observaciones: z
        .string()
        .max(500, "Las observaciones no pueden superar los 500 caracteres.")
        .optional(),
});

/**
 * Reglas del body de PATCH /api/solicitudes/:id/estado.
 *
 * Solo se acepta un estado de la lista ESTADOS_SOLICITUD.
 * Que el cambio sea válido según el estado actual lo revisa
 * después el middleware verificarTransicionEstado.
 */
export const cambiarEstadoSchema = z.object({
    estado: z.enum(ESTADOS_SOLICITUD, {
        message: `El estado debe ser uno de: ${ESTADOS_SOLICITUD.join(", ")}.`,
    }),

    observaciones: z
        .string()
        .max(500, "Las observaciones no pueden superar los 500 caracteres.")
        .optional(),
});

/**
 * Reglas del body de PUT /api/solicitudes/:id.
 *
 * El administrador solo puede corregir la cantidad y las observaciones,
 * y únicamente mientras la solicitud siga pendiente. La clínica, el
 * medicamento y el almacén no se cambian: para eso se anula la
 * solicitud y se crea una nueva.
 */
export const actualizarSolicitudSchema = z
    .object({
        cantidad_solicitada: z
            .number({ error: "La cantidad solicitada debe ser un número." })
            .int("La cantidad solicitada debe ser un número entero.")
            .positive("La cantidad solicitada debe ser mayor que cero.")
            .optional(),

        observaciones: z
            .string()
            .max(500, "Las observaciones no pueden superar los 500 caracteres.")
            .optional(),
    })
    .refine((datos) => Object.keys(datos).length > 0, {
        message: "Debe enviar al menos un campo para actualizar.",
    });

export type CrearSolicitudInput = z.infer<typeof crearSolicitudSchema>;
export type CambiarEstadoInput = z.infer<typeof cambiarEstadoSchema>;
export type ActualizarSolicitudInput = z.infer<typeof actualizarSolicitudSchema>;
