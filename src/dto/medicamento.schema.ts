import { z } from "zod";

/**
 * Reglas que debe cumplir el body de POST /api/medicamentos.
 *
 * El texto que va dentro de z.string({ error: ... }) es el mensaje
 * que se muestra cuando el campo no viene o viene con otro tipo.
 * Los mensajes de .min() y .max() aplican cuando sí es texto
 * pero tiene un largo incorrecto.
 */
export const crearMedicamentoSchema = z.object({
    nombre: z
        .string({ error: "El nombre es obligatorio y debe ser texto." })
        .min(3, "El nombre debe tener al menos 3 caracteres.")
        .max(150, "El nombre no puede superar los 150 caracteres."),

    descripcion: z
        .string({ error: "La descripción es obligatoria y debe ser texto." })
        .min(5, "La descripción debe tener al menos 5 caracteres.")
        .max(255, "La descripción no puede superar los 255 caracteres."),

    presentacion: z
        .string({ error: "La presentación es obligatoria y debe ser texto." })
        .min(3, "La presentación debe tener al menos 3 caracteres.")
        .max(100, "La presentación no puede superar los 100 caracteres."),

    laboratorio: z
        .string({ error: "El laboratorio es obligatorio y debe ser texto." })
        .min(3, "El laboratorio debe tener al menos 3 caracteres.")
        .max(150, "El laboratorio no puede superar los 150 caracteres."),
});

/**
 * Reglas del body de PUT /api/medicamentos/:id.
 */
export const actualizarMedicamentoSchema = crearMedicamentoSchema
    .partial()
    .refine((datos) => Object.keys(datos).length > 0, {
        message: "Debe enviar al menos un campo para actualizar.",
    });

export type CrearMedicamentoInput = z.infer<typeof crearMedicamentoSchema>;
export type ActualizarMedicamentoInput = z.infer<typeof actualizarMedicamentoSchema>;
