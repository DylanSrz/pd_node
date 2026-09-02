import { z } from "zod";

/**
 * Validates that the :id of the route is a UUID.
 *
 * It is useful to reject an id with a wrong format right away,
 * before going to query the database.
 *
 * It is used together with the validateParams middleware, for example:
 *   router.get("/:id", validateParams(idSchema), getClinicById)
 */
export const idSchema = z.object({
    id: z.uuid("The id must have UUID format."),
});
