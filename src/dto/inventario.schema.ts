import { z } from "zod";

/**
 * Reglas que debe cumplir el body de POST /api/inventario.
 *
 * Un registro de inventario dice cuántas unidades de un medicamento
 * hay en un almacén concreto.
 */
export const crearInventarioSchema = z.object({
    almacen_id: z.uuid("El almacen_id es obligatorio y debe tener formato UUID."),

    medicamento_id: z.uuid("El medicamento_id es obligatorio y debe tener formato UUID."),

    cantidad: z
        .number({ error: "La cantidad es obligatoria y debe ser un número." })
        .int("La cantidad debe ser un número entero.")
        .min(0, "La cantidad no puede ser negativa."),
});

/**
 * Reglas del body de PUT /api/inventario/:id.
 *
 * Solo se permite cambiar la cantidad: el almacén y el medicamento
 * son los que identifican el registro, y cambiarlos equivaldría
 * a crear uno distinto.
 */
export const actualizarInventarioSchema = z.object({
    cantidad: z
        .number({ error: "La cantidad es obligatoria y debe ser un número." })
        .int("La cantidad debe ser un número entero.")
        .min(0, "La cantidad no puede ser negativa."),
});

export type CrearInventarioInput = z.infer<typeof crearInventarioSchema>;
export type ActualizarInventarioInput = z.infer<typeof actualizarInventarioSchema>;
