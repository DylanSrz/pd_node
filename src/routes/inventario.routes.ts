import { Router } from "express";

import {
    deleteInventario,
    getInventario,
    getInventarioPorId,
    postInventario,
    putInventario,
} from "../controllers/inventario.controller.js";
import { checkRole, verifyToken } from "../middlewares/verifyToken.js";
import { validateParams, validateRequest } from "../middlewares/validate_request.js";
import {
    actualizarInventarioSchema,
    crearInventarioSchema,
} from "../dto/inventario.schema.js";
import { idSchema } from "../dto/id.schema.js";

const router = Router();

// Todas las rutas de inventario exigen token.
router.use(verifyToken);

/**
 * @swagger
 * /api/inventario:
 *   get:
 *     tags: [Inventario]
 *     summary: Listar las existencias de todos los almacenes
 *     description: >
 *       Cada registro dice cuántas unidades de un medicamento hay en
 *       un almacén. El gestor lo consulta para saber qué puede pedir.
 *     responses:
 *       200:
 *         description: Inventario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inventario encontrado.
 *                 total:
 *                   type: integer
 *                   example: 9
 *                 inventario:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inventario'
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// El gestor necesita consultarlo para saber qué puede pedir.
router.get("/", getInventario);

/**
 * @swagger
 * /api/inventario/{id}:
 *   get:
 *     tags: [Inventario]
 *     summary: Consultar un registro de inventario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Registro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registro de inventario encontrado.
 *                 inventario:
 *                   $ref: '#/components/schemas/Inventario'
 *       400:
 *         description: El id no tiene formato UUID
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       404:
 *         description: El registro no existe o fue eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateParams(idSchema), getInventarioPorId);

/**
 * @swagger
 * /api/inventario:
 *   post:
 *     tags: [Inventario]
 *     summary: Registrar las existencias de un medicamento en un almacén
 *     description: >
 *       Solo el administrador. Revisa que el almacén y el medicamento
 *       existan, y que ese par no esté ya registrado. Para cambiar una
 *       cantidad existente se usa PUT, no POST.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [almacen_id, medicamento_id, cantidad]
 *             properties:
 *               almacen_id:
 *                 type: string
 *                 format: uuid
 *               medicamento_id:
 *                 type: string
 *                 format: uuid
 *               cantidad:
 *                 type: integer
 *                 minimum: 0
 *                 example: 500
 *     responses:
 *       201:
 *         description: Registro creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registro de inventario creado correctamente.
 *                 inventario:
 *                   $ref: '#/components/schemas/Inventario'
 *       400:
 *         description: Datos inválidos o cantidad negativa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorValidacion'
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       403:
 *         description: El usuario no es administrador
 *       404:
 *         description: El almacén o el medicamento no existen
 *       409:
 *         description: Ese medicamento ya está registrado en ese almacén
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
    "/",
    checkRole("administrador"),
    validateRequest(crearInventarioSchema),
    postInventario
);

/**
 * @swagger
 * /api/inventario/{id}:
 *   put:
 *     tags: [Inventario]
 *     summary: Cambiar la cantidad disponible
 *     description: >
 *       Solo el administrador. Solo se puede cambiar la cantidad: el
 *       almacén y el medicamento son los que identifican el registro.
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
 *             required: [cantidad]
 *             properties:
 *               cantidad:
 *                 type: integer
 *                 minimum: 0
 *                 example: 350
 *     responses:
 *       200:
 *         description: Inventario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inventario actualizado correctamente.
 *                 inventario:
 *                   $ref: '#/components/schemas/Inventario'
 *       400:
 *         description: Cantidad inválida o negativa
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       403:
 *         description: El usuario no es administrador
 *       404:
 *         description: El registro no existe o fue eliminado
 */
router.put(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    validateRequest(actualizarInventarioSchema),
    putInventario
);

/**
 * @swagger
 * /api/inventario/{id}:
 *   delete:
 *     tags: [Inventario]
 *     summary: Eliminar lógicamente un registro de inventario
 *     description: Solo el administrador. Le pone is_active en false.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Registro eliminado correctamente
 *       400:
 *         description: El id no tiene formato UUID
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       403:
 *         description: El usuario no es administrador
 *       404:
 *         description: El registro no existe o ya estaba eliminado
 */
router.delete(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    deleteInventario
);

export default router;
