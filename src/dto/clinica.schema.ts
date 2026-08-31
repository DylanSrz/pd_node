import { z } from "zod";

/**
 * Reglas que debe cumplir el body de POST /api/clinicas.
 * Todos los campos son obligatorios al crear una clínica.
 */
export const crearClinicaSchema = z.object({
    nombre: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres.")
        .max(150, "El nombre no puede superar los 150 caracteres."),

    nit: z
        .string()
        .min(5, "El NIT debe tener al menos 5 caracteres.")
        .max(20, "El NIT no puede superar los 20 caracteres."),

    direccion: z
        .string()
        .min(5, "La dirección debe tener al menos 5 caracteres.")
        .max(200, "La dirección no puede superar los 200 caracteres."),

    telefono: z
        .string()
        .min(7, "El teléfono debe tener al menos 7 caracteres.")
        .max(20, "El teléfono no puede superar los 20 caracteres."),

    email: z.email("El correo de la clínica no tiene un formato válido."),

    responsable_nombre: z
        .string()
        .min(3, "El nombre del responsable debe tener al menos 3 caracteres.")
        .max(150, "El nombre del responsable no puede superar los 150 caracteres."),

    responsable_email: z.email("El correo del responsable no tiene un formato válido."),

    responsable_telefono: z
        .string()
        .min(7, "El teléfono del responsable debe tener al menos 7 caracteres.")
        .max(20, "El teléfono del responsable no puede superar los 20 caracteres."),
});

/**
 * Reglas que debe cumplir el body de PUT /api/clinicas/:id.
 *
 * .partial() vuelve opcionales todos los campos del esquema de crear,
 * porque al actualizar se puede enviar solo lo que se quiere cambiar.
 * Aun así, el campo que se envíe debe cumplir su misma regla.
 */
export const actualizarClinicaSchema = crearClinicaSchema
    .partial()
    .refine((datos) => Object.keys(datos).length > 0, {
        message: "Debe enviar al menos un campo para actualizar.",
    });

// Tipos que salen de los esquemas, para usarlos en el service.
export type CrearClinicaInput = z.infer<typeof crearClinicaSchema>;
export type ActualizarClinicaInput = z.infer<typeof actualizarClinicaSchema>;
