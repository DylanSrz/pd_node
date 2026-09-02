import { Router } from "express";

import {
    deleteInventory,
    getInventory,
    getInventoryById,
    postInventory,
    putInventory,
} from "../controllers/inventory.controller.js";
import { checkRole, verifyToken } from "../middlewares/verifyToken.js";
import { validateParams, validateRequest } from "../middlewares/validate-request.js";
import {
    updateInventorySchema,
    createInventorySchema,
} from "../dto/inventory.schema.js";
import { idSchema } from "../dto/id.schema.js";

const router = Router();

// Every inventory route requires a token.
router.use(verifyToken);

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     tags: [Inventory]
 *     summary: List the stock of every warehouse
 *     description: >
 *       Each record tells how many units of a medication there are in
 *       a warehouse. The manager queries it to know what can be requested.
 *     responses:
 *       200:
 *         description: Inventory found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inventory found.
 *                 total:
 *                   type: integer
 *                   example: 9
 *                 inventory:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inventory'
 *       401:
 *         description: Token not provided, invalid or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// The manager needs to query it to know what can be requested.
router.get("/", getInventory);

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     tags: [Inventory]
 *     summary: Query an inventory record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Record found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inventory record found.
 *                 inventory:
 *                   $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: The id does not have UUID format
 *       401:
 *         description: Token not provided, invalid or expired
 *       404:
 *         description: The record does not exist or was deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateParams(idSchema), getInventoryById);

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     tags: [Inventory]
 *     summary: Register the stock of a medication in a warehouse
 *     description: >
 *       Only the admin. It checks that the warehouse and the medication
 *       exist, and that the pair is not already registered. To change an
 *       existing quantity, PUT is used, not POST.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [warehouse_id, medication_id, quantity]
 *             properties:
 *               warehouse_id:
 *                 type: string
 *                 format: uuid
 *               medication_id:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 example: 500
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inventory record created successfully.
 *                 inventory:
 *                   $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Invalid data or negative quantity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Token not provided, invalid or expired
 *       403:
 *         description: The user is not an admin
 *       404:
 *         description: The warehouse or the medication do not exist
 *       409:
 *         description: That medication is already registered in that warehouse
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
    "/",
    checkRole("admin"),
    validateRequest(createInventorySchema),
    postInventory
);

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     tags: [Inventory]
 *     summary: Change the available quantity
 *     description: >
 *       Only the admin. Only the quantity can be changed: the
 *       warehouse and the medication are what identify the record.
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
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 example: 350
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inventory updated successfully.
 *                 inventory:
 *                   $ref: '#/components/schemas/Inventory'
 *       400:
 *         description: Invalid or negative quantity
 *       401:
 *         description: Token not provided, invalid or expired
 *       403:
 *         description: The user is not an admin
 *       404:
 *         description: The record does not exist or was deleted
 */
router.put(
    "/:id",
    checkRole("admin"),
    validateParams(idSchema),
    validateRequest(updateInventorySchema),
    putInventory
);

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     tags: [Inventory]
 *     summary: Logically delete an inventory record
 *     description: Only the admin. It sets is_active to false.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       400:
 *         description: The id does not have UUID format
 *       401:
 *         description: Token not provided, invalid or expired
 *       403:
 *         description: The user is not an admin
 *       404:
 *         description: The record does not exist or was already deleted
 */
router.delete(
    "/:id",
    checkRole("admin"),
    validateParams(idSchema),
    deleteInventory
);

export default router;
