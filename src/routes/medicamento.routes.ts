import { Router } from "express";

import {
    deleteMedicamento,
    getMedicamentoPorId,
    getMedicamentos,
    postMedicamento,
    putMedicamento,
} from "../controllers/medicamento.controller.js";
import { checkRole, verifyToken } from "../middlewares/verifyToken.js";
import { validateParams, validateRequest } from "../middlewares/validate_request.js";
import {
    actualizarMedicamentoSchema,
    crearMedicamentoSchema,
} from "../dto/medicamento.schema.js";
import { idSchema } from "../dto/id.schema.js";

const router = Router();

// Todas las rutas de medicamentos exigen token.
router.use(verifyToken);

/**
 * @swagger
 * /api/medicamentos:
 *   get:
 *     tags: [Medicamentos]
 *     summary: Listar el catálogo de medicamentos activos
 *     description: >
 *       Consulta abierta a cualquier usuario autenticado. Las
 *       cantidades disponibles no salen aquí, sino en /api/inventario,
 *       porque dependen de cada almacén.
 *     responses:
 *       200:
 *         description: Medicamentos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Medicamentos encontrados.
 *                 total:
 *                   type: integer
 *                   example: 6
 *                 medicamentos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Medicamento'
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getMedicamentos);

/**
 * @swagger
 * /api/medicamentos/{id}:
 *   get:
 *     tags: [Medicamentos]
 *     summary: Consultar un medicamento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Medicamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Medicamento encontrado.
 *                 medicamento:
 *                   $ref: '#/components/schemas/Medicamento'
 *       400:
 *         description: El id no tiene formato UUID
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       404:
 *         description: El medicamento no existe o fue eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateParams(idSchema), getMedicamentoPorId);

/**
 * @swagger
 * /api/medicamentos:
 *   post:
 *     tags: [Medicamentos]
 *     summary: Registrar un medicamento nuevo
 *     description: Solo el administrador.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, descripcion, presentacion, laboratorio]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Acetaminofén 500mg
 *               descripcion:
 *                 type: string
 *                 example: Analgésico y antipirético de uso general.
 *               presentacion:
 *                 type: string
 *                 example: Caja x 30 tabletas
 *               laboratorio:
 *                 type: string
 *                 example: Genfar
 *     responses:
 *       201:
 *         description: Medicamento creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Medicamento creado correctamente.
 *                 medicamento:
 *                   $ref: '#/components/schemas/Medicamento'
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
    validateRequest(crearMedicamentoSchema),
    postMedicamento
);

/**
 * @swagger
 * /api/medicamentos/{id}:
 *   put:
 *     tags: [Medicamentos]
 *     summary: Actualizar un medicamento
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
 *               descripcion:
 *                 type: string
 *               presentacion:
 *                 type: string
 *                 example: Caja x 60 tabletas
 *               laboratorio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medicamento actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Medicamento actualizado correctamente.
 *                 medicamento:
 *                   $ref: '#/components/schemas/Medicamento'
 *       400:
 *         description: Datos inválidos o body vacío
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       403:
 *         description: El usuario no es administrador
 *       404:
 *         description: El medicamento no existe o fue eliminado
 */
router.put(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    validateRequest(actualizarMedicamentoSchema),
    putMedicamento
);

/**
 * @swagger
 * /api/medicamentos/{id}:
 *   delete:
 *     tags: [Medicamentos]
 *     summary: Eliminar lógicamente un medicamento
 *     description: >
 *       Solo el administrador. Le pone is_active en false para
 *       conservar el inventario y el historial que lo referencian.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Medicamento eliminado correctamente
 *       400:
 *         description: El id no tiene formato UUID
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       403:
 *         description: El usuario no es administrador
 *       404:
 *         description: El medicamento no existe o ya estaba eliminado
 */
router.delete(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    deleteMedicamento
);

export default router;
