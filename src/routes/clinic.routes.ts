import { Router } from "express";

import {
    deleteClinic,
    getClinicById,
    getClinics,
    postClinic,
    putClinic,
} from "../controllers/clinic.controller.js";
import { getRequestsByClinic } from "../controllers/request.controller.js";
import { checkRole, verifyToken } from "../middlewares/verifyToken.js";
import { validateParams, validateRequest } from "../middlewares/validate-request.js";
import { verifyUniqueTaxId } from "../middlewares/verify-unique-tax-id.js";
import {
    updateClinicSchema,
    createClinicSchema,
} from "../dto/clinic.schema.js";
import { idSchema } from "../dto/id.schema.js";

const router = Router();

// Every clinic route requires a token.
// By putting it up here, it applies to the routes below
// without having to repeat it in each one.
router.use(verifyToken);

/**
 * @swagger
 * /api/clinics:
 *   get:
 *     tags: [Clinics]
 *     summary: List the active clinics
 *     description: Query open to any authenticated user.
 *     responses:
 *       200:
 *         description: Clinics found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clinics found.
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 clinics:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Clinic'
 *       401:
 *         description: Token not provided, invalid or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getClinics);

/**
 * @swagger
 * /api/clinics/{id}:
 *   get:
 *     tags: [Clinics]
 *     summary: Query a clinic and its manager
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID identifier of the clinic
 *     responses:
 *       200:
 *         description: Clinic found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clinic found.
 *                 clinic:
 *                   $ref: '#/components/schemas/Clinic'
 *       400:
 *         description: The id does not have UUID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Token not provided, invalid or expired
 *       404:
 *         description: The clinic does not exist or was deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateParams(idSchema), getClinicById);

/**
 * @swagger
 * /api/clinics/{id}/requests:
 *   get:
 *     tags: [Clinics]
 *     summary: Query the request history of a clinic
 *     description: >
 *       Returns every request made by the clinic, in any status.
 *       Open to any authenticated user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID identifier of the clinic
 *     responses:
 *       200:
 *         description: History found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request history of the clinic found.
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 requests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *       400:
 *         description: The id does not have UUID format
 *       401:
 *         description: Token not provided, invalid or expired
 *       404:
 *         description: The clinic does not exist or was deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Request history of a clinic. The statement asks that any
// authenticated user can query it.
router.get("/:id/requests", validateParams(idSchema), getRequestsByClinic);

/**
 * @swagger
 * /api/clinics:
 *   post:
 *     tags: [Clinics]
 *     summary: Register a new clinic
 *     description: Only the admin. The tax id cannot be repeated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               [name, tax_id, address, phone, email,
 *                manager_name, manager_email, manager_phone]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Clínica Las Américas
 *               tax_id:
 *                 type: string
 *                 example: 890900123-1
 *               address:
 *                 type: string
 *                 example: Diagonal 75B No 2A-80, Medellín
 *               phone:
 *                 type: string
 *                 example: "6043421010"
 *               email:
 *                 type: string
 *                 example: contacto@lasamericas.com
 *               manager_name:
 *                 type: string
 *                 example: Ana Gómez Ruiz
 *               manager_email:
 *                 type: string
 *                 example: ana.gomez@lasamericas.com
 *               manager_phone:
 *                 type: string
 *                 example: "3001112233"
 *     responses:
 *       201:
 *         description: Clinic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clinic created successfully.
 *                 clinic:
 *                   $ref: '#/components/schemas/Clinic'
 *       400:
 *         description: Invalid or incomplete data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Token not provided, invalid or expired
 *       403:
 *         description: The user is not an admin
 *       409:
 *         description: A clinic with that tax id already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Only the admin. Before creating, it is checked that the tax id does not exist.
router.post(
    "/",
    checkRole("admin"),
    validateRequest(createClinicSchema),
    verifyUniqueTaxId,
    postClinic
);

/**
 * @swagger
 * /api/clinics/{id}:
 *   put:
 *     tags: [Clinics]
 *     summary: Update a clinic
 *     description: >
 *       Only the admin. Only the fields that need to change are sent.
 *       If the tax id is changed, it is checked that it does not clash
 *       with the one of another clinic.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               tax_id:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *                 example: "6045550000"
 *               email:
 *                 type: string
 *               manager_name:
 *                 type: string
 *               manager_email:
 *                 type: string
 *               manager_phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Clinic updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clinic updated successfully.
 *                 clinic:
 *                   $ref: '#/components/schemas/Clinic'
 *       400:
 *         description: Invalid data or empty body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Token not provided, invalid or expired
 *       403:
 *         description: The user is not an admin
 *       404:
 *         description: The clinic does not exist or was deleted
 *       409:
 *         description: Another clinic already has that tax id
 */
router.put(
    "/:id",
    checkRole("admin"),
    validateParams(idSchema),
    validateRequest(updateClinicSchema),
    verifyUniqueTaxId,
    putClinic
);

/**
 * @swagger
 * /api/clinics/{id}:
 *   delete:
 *     tags: [Clinics]
 *     summary: Logically delete a clinic
 *     description: >
 *       Only the admin. It does not remove the record: it sets
 *       is_active to false, in order to keep the history of
 *       requests that reference it.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Clinic deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clinic deleted successfully.
 *       400:
 *         description: The id does not have UUID format
 *       401:
 *         description: Token not provided, invalid or expired
 *       403:
 *         description: The user is not an admin
 *       404:
 *         description: The clinic does not exist or was already deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", checkRole("admin"), validateParams(idSchema), deleteClinic);

export default router;
