import { z } from "zod";

/**
 * Reglas que debe cumplir el body de POST /api/almacenes.
 *
 * El texto que va dentro de z.string({ error: ... }) es el mensaje
 * que se muestra cuando el campo no viene o viene con otro tipo.
 */
export const crearAlmacenSchema = z.object({
    nombre: z
        .string({ error: "El nombre es obligatorio y debe ser texto." })
        .min(3, "El nombre debe tener al menos 3 caracteres.")
        .max(150, "El nombre no puede superar los 150 caracteres."),

    direccion: z
        .string({ error: "La dirección es obligatoria y debe ser texto." })
        .min(5, "La dirección debe tener al menos 5 caracteres.")
        .max(200, "La dirección no puede superar los 200 caracteres."),

    telefono: z
        .string({ error: "El teléfono es obligatorio y debe ser texto." })
        .min(7, "El teléfono debe tener al menos 7 caracteres.")
        .max(20, "El teléfono no puede superar los 20 caracteres."),
});

/**
 * Reglas del body de PUT /api/almacenes/:id.
 *
 * .partial() vuelve opcionales todos los campos, porque al actualizar
 * se puede enviar solo lo que se quiere cambiar.
 */
export const actualizarAlmacenSchema = crearAlmacenSchema
    .partial()
    .refine((datos) => Object.keys(datos).length > 0, {
        message: "Debe enviar al menos un campo para actualizar.",
    });

export type CrearAlmacenInput = z.infer<typeof crearAlmacenSchema>;
export type ActualizarAlmacenInput = z.infer<typeof actualizarAlmacenSchema>;
