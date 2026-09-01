import { z } from "zod";

/**
 * Valida que el :id de la ruta sea un UUID.
 *
 * Sirve para rechazar de una vez un id con formato incorrecto,
 * antes de ir a consultar la base de datos.
 *
 * Se usa junto al middleware validateParams, por ejemplo:
 *   router.get("/:id", validateParams(idSchema), obtenerClinica)
 */
export const idSchema = z.object({
    id: z.uuid("El id debe tener formato UUID."),
});
