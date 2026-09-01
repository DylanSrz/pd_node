import { Router } from "express";

import {
    deleteAlmacen,
    getAlmacenPorId,
    getAlmacenes,
    postAlmacen,
    putAlmacen,
} from "../controllers/almacen.controller.js";
import { checkRole, verifyToken } from "../middlewares/verifyToken.js";
import { validateParams, validateRequest } from "../middlewares/validate_request.js";
import {
    actualizarAlmacenSchema,
    crearAlmacenSchema,
} from "../dto/almacen.schema.js";
import { idSchema } from "../dto/id.schema.js";

const router = Router();

// Todas las rutas de almacenes exigen token.
router.use(verifyToken);

/**
 * @swagger
 * /api/almacenes:
 *   get:
 *     tags: [Almacenes]
 *     summary: Listar los almacenes activos
 *     description: Consulta abierta a cualquier usuario autenticado.
 *     responses:
 *       200:
 *         description: Almacenes encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Almacenes encontrados.
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 almacenes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Almacen'
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getAlmacenes);

/**
 * @swagger
 * /api/almacenes/{id}:
 *   get:
 *     tags: [Almacenes]
 *     summary: Consultar un almacén
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Almacén encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Almacén encontrado.
 *                 almacen:
 *                   $ref: '#/components/schemas/Almacen'
 *       400:
 *         description: El id no tiene formato UUID
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       404:
 *         description: El almacén no existe o fue eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateParams(idSchema), getAlmacenPorId);

/**
 * @swagger
 * /api/almacenes:
 *   post:
 *     tags: [Almacenes]
 *     summary: Registrar un almacén nuevo
 *     description: Solo el administrador.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, direccion, telefono]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Almacén Central Medellín
 *               direccion:
 *                 type: string
 *                 example: Carrera 50 No 20-30, Medellín
 *               telefono:
 *                 type: string
 *                 example: "6044441111"
 *     responses:
 *       201:
 *         description: Almacén creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Almacén creado correctamente.
 *                 almacen:
 *                   $ref: '#/components/schemas/Almacen'
 *       400:
 *         description: Datos inválidos o incompletos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorValidacion'
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       403:
 *         description: El usuario no es administrador
 */
router.post(
    "/",
    checkRole("administrador"),
    validateRequest(crearAlmacenSchema),
    postAlmacen
);

/**
 * @swagger
 * /api/almacenes/{id}:
 *   put:
 *     tags: [Almacenes]
 *     summary: Actualizar un almacén
 *     description: Solo el administrador. Se envían solo los campos a cambiar.
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
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *                 example: "6044442222"
 *     responses:
 *       200:
 *         description: Almacén actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Almacén actualizado correctamente.
 *                 almacen:
 *                   $ref: '#/components/schemas/Almacen'
 *       400:
 *         description: Datos inválidos o body vacío
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       403:
 *         description: El usuario no es administrador
 *       404:
 *         description: El almacén no existe o fue eliminado
 */
router.put(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    validateRequest(actualizarAlmacenSchema),
    putAlmacen
);

/**
 * @swagger
 * /api/almacenes/{id}:
 *   delete:
 *     tags: [Almacenes]
 *     summary: Eliminar lógicamente un almacén
 *     description: >
 *       Solo el administrador. Le pone is_active en false para
 *       conservar el inventario y las solicitudes que lo referencian.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Almacén eliminado correctamente
 *       400:
 *         description: El id no tiene formato UUID
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       403:
 *         description: El usuario no es administrador
 *       404:
 *         description: El almacén no existe o ya estaba eliminado
 */
router.delete("/:id", checkRole("administrador"), validateParams(idSchema), deleteAlmacen);

export default router;
