import { Router } from "express";

import {
    deleteRequest,
    getRequestHistory,
    getRequestById,
    getRequests,
    patchRequestStatus,
    postRequest,
    putRequest,
} from "../controllers/request.controller.js";
import { checkRole, verifyToken } from "../middlewares/verifyToken.js";
import { validateParams, validateRequest } from "../middlewares/validate-request.js";
import { verifyRelatedEntities } from "../middlewares/verify-related-entities.js";
import { verifyAvailableInventory } from "../middlewares/verify-inventory.js";
import { verifyStatusTransition } from "../middlewares/verify-status-transition.js";
import {
    updateRequestSchema,
    changeStatusSchema,
    createRequestSchema,
} from "../dto/request.schema.js";
import { idSchema } from "../dto/id.schema.js";

const router = Router();

// Every request route requires a token.
router.use(verifyToken);

/**
 * @swagger
 * /api/requests:
 *   get:
 *     tags: [Requests]
 *     summary: List the active requests
 *     description: >
 *       Returns the requests that are still in progress, that is, the
 *       ones in the pending or approved status. The rejected,
 *       delivered and cancelled ones already finished their cycle and
 *       are queried in the history. Open to any authenticated user.
 *     responses:
 *       200:
 *         description: Active requests found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Active requests found.
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 requests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *       401:
 *         description: Token not provided, invalid or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getRequests);

/**
 * @swagger
 * /api/requests/history:
 *   get:
 *     tags: [Requests]
 *     summary: Query the full history of requests
 *     description: >
 *       Returns every registered request, in any status,
 *       including the logically deleted ones. Open to
 *       any authenticated user.
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
 *                   example: Request history found.
 *                 total:
 *                   type: integer
 *                   example: 6
 *                 requests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *       401:
 *         description: Token not provided, invalid or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// It is declared BEFORE /:id. If it were after, Express
// would read the word "history" as if it were an id.
router.get("/history", getRequestHistory);

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     tags: [Requests]
 *     summary: Query a request
 *     description: >
 *       Returns the request with the data of the clinic, the
 *       medication, the warehouse and the user who registered it.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Request found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request found.
 *                 request:
 *                   $ref: '#/components/schemas/Request'
 *       400:
 *         description: The id does not have UUID format
 *       401:
 *         description: Token not provided, invalid or expired
 *       404:
 *         description: The request does not exist or was deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateParams(idSchema), getRequestById);

/**
 * @swagger
 * /api/requests:
 *   post:
 *     tags: [Requests]
 *     summary: Register a supply request
 *     description: >
 *       It is registered by the request manager and by the admin.
 *       The user creating it is taken from the token, not from the body,
 *       so that nobody can register it on behalf of another person, and
 *       the initial status is always "pending".
 *
 *       Before creating it, the following is checked, in this order: that
 *       the data has the right format and the quantity is greater than
 *       zero, that the clinic, the medication and the warehouse exist,
 *       and that the warehouse has enough inventory. The inventory is not
 *       discounted yet: that happens when the request is approved.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clinic_id, medication_id, warehouse_id, requested_quantity]
 *             properties:
 *               clinic_id:
 *                 type: string
 *                 format: uuid
 *               medication_id:
 *                 type: string
 *                 format: uuid
 *               warehouse_id:
 *                 type: string
 *                 format: uuid
 *               requested_quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 100
 *               notes:
 *                 type: string
 *                 example: Pedido mensual de analgésicos.
 *     responses:
 *       201:
 *         description: Request registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request registered successfully.
 *                 request:
 *                   $ref: '#/components/schemas/Request'
 *       400:
 *         description: >
 *           Quantity lower than or equal to zero, the warehouse does not
 *           handle that medication, or it does not have enough inventory.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: The warehouse does not have enough inventory of that medication.
 *                 requested_quantity:
 *                   type: integer
 *                   example: 500
 *                 available_quantity:
 *                   type: integer
 *                   example: 100
 *       401:
 *         description: Token not provided, invalid or expired
 *       403:
 *         description: The user does not have an allowed role
 *       404:
 *         description: The clinic, the medication or the warehouse do not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Before creating it, the following is checked, in this order:
//   1. that the data has the right format and the quantity is > 0,
//   2. that the clinic, the medication and the warehouse exist,
//   3. that the warehouse has enough inventory.
router.post(
    "/",
    checkRole("manager", "admin"),
    validateRequest(createRequestSchema),
    verifyRelatedEntities,
    verifyAvailableInventory,
    postRequest
);

/**
 * @swagger
 * /api/requests/{id}/status:
 *   patch:
 *     tags: [Requests]
 *     summary: Change the status of a request
 *     description: >
 *       Only the status changes that make sense are accepted:
 *
 *       - pending can move to approved, rejected or cancelled
 *       - approved can move to delivered or cancelled
 *       - rejected, delivered and cancelled are final statuses
 *
 *       When moving to "approved" the units are discounted from the
 *       warehouse. When cancelling a request that was approved, they are
 *       given back. Everything is done inside a transaction.
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, delivered, cancelled]
 *                 example: approved
 *               notes:
 *                 type: string
 *                 example: Aprobada por el administrador.
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request status updated to 'approved'.
 *                 request:
 *                   $ref: '#/components/schemas/Request'
 *       400:
 *         description: Status transition not allowed or not enough inventory
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: It is not possible to go from 'pending' to 'delivered'.
 *                 current_status:
 *                   type: string
 *                   example: pending
 *                 allowed_statuses:
 *                   type: string
 *                   example: approved, rejected, cancelled
 *       401:
 *         description: Token not provided, invalid or expired
 *       403:
 *         description: The user does not have an allowed role
 *       404:
 *         description: The request does not exist or was deleted
 */
// verifyStatusTransition rejects the jumps that make no sense,
// for example from pending to delivered.
router.patch(
    "/:id/status",
    checkRole("manager", "admin"),
    validateParams(idSchema),
    validateRequest(changeStatusSchema),
    verifyStatusTransition,
    patchRequestStatus
);

/**
 * @swagger
 * /api/requests/{id}:
 *   put:
 *     tags: [Requests]
 *     summary: Fix the quantity or the notes
 *     description: >
 *       Only the admin, and only while the request is still
 *       pending: once approved the inventory was already discounted, and
 *       changing its quantity would leave the stock out of balance.
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
 *               requested_quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 80
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request updated successfully.
 *                 request:
 *                   $ref: '#/components/schemas/Request'
 *       400:
 *         description: Invalid data, empty body or not enough inventory
 *       401:
 *         description: Token not provided, invalid or expired
 *       403:
 *         description: The user is not an admin
 *       404:
 *         description: The request does not exist or was deleted
 *       409:
 *         description: The request is no longer pending
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
    "/:id",
    checkRole("admin"),
    validateParams(idSchema),
    validateRequest(updateRequestSchema),
    putRequest
);

/**
 * @swagger
 * /api/requests/{id}:
 *   delete:
 *     tags: [Requests]
 *     summary: Logically delete a request
 *     description: >
 *       Only the admin. It sets is_active to false. If the
 *       request was approved, it gives back to the warehouse the units
 *       that had been discounted from it.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Request deleted successfully
 *       400:
 *         description: The id does not have UUID format
 *       401:
 *         description: Token not provided, invalid or expired
 *       403:
 *         description: The user is not an admin
 *       404:
 *         description: The request does not exist or was already deleted
 */
router.delete(
    "/:id",
    checkRole("admin"),
    validateParams(idSchema),
    deleteRequest
);

export default router;
