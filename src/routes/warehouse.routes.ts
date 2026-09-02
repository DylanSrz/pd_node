import { Router } from "express";

import {
    deleteWarehouse,
    getWarehouseById,
    getWarehouses,
    postWarehouse,
    putWarehouse,
} from "../controllers/warehouse.controller.js";
import { checkRole, verifyToken } from "../middlewares/verifyToken.js";
import { validateParams, validateRequest } from "../middlewares/validate-request.js";
import {
    updateWarehouseSchema,
    createWarehouseSchema,
} from "../dto/warehouse.schema.js";
import { idSchema } from "../dto/id.schema.js";

const router = Router();

// Every warehouse route requires a token.
router.use(verifyToken);

/**
 * @swagger
 * /api/warehouses:
 *   get:
 *     tags: [Warehouses]
 *     summary: List the active warehouses
 *     description: Query open to any authenticated user.
 *     responses:
 *       200:
 *         description: Warehouses found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Warehouses found.
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 warehouses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Warehouse'
 *       401:
 *         description: Token not provided, invalid or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getWarehouses);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   get:
 *     tags: [Warehouses]
 *     summary: Query a warehouse
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Warehouse found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Warehouse found.
 *                 warehouse:
 *                   $ref: '#/components/schemas/Warehouse'
 *       400:
 *         description: The id does not have UUID format
 *       401:
 *         description: Token not provided, invalid or expired
 *       404:
 *         description: The warehouse does not exist or was deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateParams(idSchema), getWarehouseById);

/**
 * @swagger
 * /api/warehouses:
 *   post:
 *     tags: [Warehouses]
 *     summary: Register a new warehouse
 *     description: Only the admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, address, phone]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Almacén Central Medellín
 *               address:
 *                 type: string
 *                 example: Carrera 50 No 20-30, Medellín
 *               phone:
 *                 type: string
 *                 example: "6044441111"
 *     responses:
 *       201:
 *         description: Warehouse created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Warehouse created successfully.
 *                 warehouse:
 *                   $ref: '#/components/schemas/Warehouse'
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
    validateRequest(createWarehouseSchema),
    postWarehouse
);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   put:
 *     tags: [Warehouses]
 *     summary: Update a warehouse
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
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *                 example: "6044442222"
 *     responses:
 *       200:
 *         description: Warehouse updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Warehouse updated successfully.
 *                 warehouse:
 *                   $ref: '#/components/schemas/Warehouse'
 *       400:
 *         description: Invalid data or empty body
 *       401:
 *         description: Token not provided, invalid or expired
 *       403:
 *         description: The user is not an admin
 *       404:
 *         description: The warehouse does not exist or was deleted
 */
router.put(
    "/:id",
    checkRole("admin"),
    validateParams(idSchema),
    validateRequest(updateWarehouseSchema),
    putWarehouse
);

/**
 * @swagger
 * /api/warehouses/{id}:
 *   delete:
 *     tags: [Warehouses]
 *     summary: Logically delete a warehouse
 *     description: >
 *       Only the admin. It sets is_active to false in order to
 *       keep the inventory and the requests that reference it.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Warehouse deleted successfully
 *       400:
 *         description: The id does not have UUID format
 *       401:
 *         description: Token not provided, invalid or expired
 *       403:
 *         description: The user is not an admin
 *       404:
 *         description: The warehouse does not exist or was already deleted
 */
router.delete("/:id", checkRole("admin"), validateParams(idSchema), deleteWarehouse);

export default router;
