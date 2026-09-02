import { Router } from "express";

import {
    deleteMedication,
    getMedicationById,
    getMedications,
    postMedication,
    putMedication,
} from "../controllers/medication.controller.js";
import { checkRole, verifyToken } from "../middlewares/verifyToken.js";
import { validateParams, validateRequest } from "../middlewares/validate-request.js";
import {
    updateMedicationSchema,
    createMedicationSchema,
} from "../dto/medication.schema.js";
import { idSchema } from "../dto/id.schema.js";

const router = Router();

// Every medication route requires a token.
router.use(verifyToken);

/**
 * @swagger
 * /api/medications:
 *   get:
 *     tags: [Medications]
 *     summary: List the catalog of active medications
 *     description: >
 *       Query open to any authenticated user. The available
 *       quantities do not show up here but in /api/inventory,
 *       because they depend on each warehouse.
 *     responses:
 *       200:
 *         description: Medications found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Medications found.
 *                 total:
 *                   type: integer
 *                   example: 6
 *                 medications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Medication'
 *       401:
 *         description: Token not provided, invalid or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getMedications);

/**
 * @swagger
 * /api/medications/{id}:
 *   get:
 *     tags: [Medications]
 *     summary: Query a medication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Medication found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Medication found.
 *                 medication:
 *                   $ref: '#/components/schemas/Medication'
 *       400:
 *         description: The id does not have UUID format
 *       401:
 *         description: Token not provided, invalid or expired
 *       404:
 *         description: The medication does not exist or was deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateParams(idSchema), getMedicationById);

/**
 * @swagger
 * /api/medications:
 *   post:
 *     tags: [Medications]
 *     summary: Register a new medication
 *     description: Only the admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, presentation, laboratory]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Acetaminofén 500mg
 *               description:
 *                 type: string
 *                 example: Analgésico y antipirético de uso general.
 *               presentation:
 *                 type: string
 *                 example: Caja x 30 tabletas
 *               laboratory:
 *                 type: string
 *                 example: Genfar
 *     responses:
 *       201:
 *         description: Medication created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Medication created successfully.
 *                 medication:
 *                   $ref: '#/components/schemas/Medication'
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
 */
router.post(
    "/",
    checkRole("admin"),
    validateRequest(createMedicationSchema),
    postMedication
);

/**
 * @swagger
 * /api/medications/{id}:
 *   put:
 *     tags: [Medications]
 *     summary: Update a medication
 *     description: Only the admin. Only the fields to change are sent.
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
 *               description:
 *                 type: string
 *               presentation:
 *                 type: string
 *                 example: Caja x 60 tabletas
 *               laboratory:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medication updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Medication updated successfully.
 *                 medication:
 *                   $ref: '#/components/schemas/Medication'
 *       400:
 *         description: Invalid data or empty body
 *       401:
 *         description: Token not provided, invalid or expired
 *       403:
 *         description: The user is not an admin
 *       404:
 *         description: The medication does not exist or was deleted
 */
router.put(
    "/:id",
    checkRole("admin"),
    validateParams(idSchema),
    validateRequest(updateMedicationSchema),
    putMedication
);

/**
 * @swagger
 * /api/medications/{id}:
 *   delete:
 *     tags: [Medications]
 *     summary: Logically delete a medication
 *     description: >
 *       Only the admin. It sets is_active to false in order to
 *       keep the inventory and the history that reference it.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Medication deleted successfully
 *       400:
 *         description: The id does not have UUID format
 *       401:
 *         description: Token not provided, invalid or expired
 *       403:
 *         description: The user is not an admin
 *       404:
 *         description: The medication does not exist or was already deleted
 */
router.delete(
    "/:id",
    checkRole("admin"),
    validateParams(idSchema),
    deleteMedication
);

export default router;
