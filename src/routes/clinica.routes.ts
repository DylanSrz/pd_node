import { Router } from "express";

import {
    deleteClinica,
    getClinicaPorId,
    getClinicas,
    postClinica,
    putClinica,
} from "../controllers/clinica.controller.js";
import { getSolicitudesPorClinica } from "../controllers/solicitud.controller.js";
import { checkRole, verifyToken } from "../middlewares/verifyToken.js";
import { validateParams, validateRequest } from "../middlewares/validate_request.js";
import { verificarNitUnico } from "../middlewares/verificar-nit-unico.js";
import {
    actualizarClinicaSchema,
    crearClinicaSchema,
} from "../dto/clinica.schema.js";
import { idSchema } from "../dto/id.schema.js";

const router = Router();

// Todas las rutas de clínicas exigen token.
// Al ponerlo aquí arriba, se aplica a las rutas de abajo
// sin tener que repetirlo en cada una.
router.use(verifyToken);

/**
 * @swagger
 * /api/clinicas:
 *   get:
 *     tags: [Clínicas]
 *     summary: Listar las clínicas activas
 *     description: Consulta abierta a cualquier usuario autenticado.
 *     responses:
 *       200:
 *         description: Clínicas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clínicas encontradas.
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 clinicas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Clinica'
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getClinicas);

/**
 * @swagger
 * /api/clinicas/{id}:
 *   get:
 *     tags: [Clínicas]
 *     summary: Consultar una clínica y su responsable
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador UUID de la clínica
 *     responses:
 *       200:
 *         description: Clínica encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clínica encontrada.
 *                 clinica:
 *                   $ref: '#/components/schemas/Clinica'
 *       400:
 *         description: El id no tiene formato UUID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorValidacion'
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       404:
 *         description: La clínica no existe o fue eliminada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateParams(idSchema), getClinicaPorId);

/**
 * @swagger
 * /api/clinicas/{id}/solicitudes:
 *   get:
 *     tags: [Clínicas]
 *     summary: Consultar el historial de solicitudes de una clínica
 *     description: >
 *       Devuelve todas las solicitudes que ha hecho la clínica, en
 *       cualquier estado. Abierto a cualquier usuario autenticado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador UUID de la clínica
 *     responses:
 *       200:
 *         description: Historial encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Historial de solicitudes de la clínica encontrado.
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 solicitudes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Solicitud'
 *       400:
 *         description: El id no tiene formato UUID
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       404:
 *         description: La clínica no existe o fue eliminada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Historial de solicitudes de una clínica. El enunciado pide que
// cualquier usuario autenticado pueda consultarlo.
router.get("/:id/solicitudes", validateParams(idSchema), getSolicitudesPorClinica);

/**
 * @swagger
 * /api/clinicas:
 *   post:
 *     tags: [Clínicas]
 *     summary: Registrar una clínica nueva
 *     description: Solo el administrador. El NIT no se puede repetir.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               [nombre, nit, direccion, telefono, email,
 *                responsable_nombre, responsable_email, responsable_telefono]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Clínica Las Américas
 *               nit:
 *                 type: string
 *                 example: 890900123-1
 *               direccion:
 *                 type: string
 *                 example: Diagonal 75B No 2A-80, Medellín
 *               telefono:
 *                 type: string
 *                 example: "6043421010"
 *               email:
 *                 type: string
 *                 example: contacto@lasamericas.com
 *               responsable_nombre:
 *                 type: string
 *                 example: Ana Gómez Ruiz
 *               responsable_email:
 *                 type: string
 *                 example: ana.gomez@lasamericas.com
 *               responsable_telefono:
 *                 type: string
 *                 example: "3001112233"
 *     responses:
 *       201:
 *         description: Clínica creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clínica creada correctamente.
 *                 clinica:
 *                   $ref: '#/components/schemas/Clinica'
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
 *       409:
 *         description: Ya existe una clínica con ese NIT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Solo el administrador. Antes de crear se revisa que el NIT no exista.
router.post(
    "/",
    checkRole("administrador"),
    validateRequest(crearClinicaSchema),
    verificarNitUnico,
    postClinica
);

/**
 * @swagger
 * /api/clinicas/{id}:
 *   put:
 *     tags: [Clínicas]
 *     summary: Actualizar una clínica
 *     description: >
 *       Solo el administrador. Se envían únicamente los campos que se
 *       quieren cambiar. Si se cambia el NIT, se revisa que no choque
 *       con el de otra clínica.
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
 *               nit:
 *                 type: string
 *               direccion:
 *                 type: string
 *               telefono:
 *                 type: string
 *                 example: "6045550000"
 *               email:
 *                 type: string
 *               responsable_nombre:
 *                 type: string
 *               responsable_email:
 *                 type: string
 *               responsable_telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Clínica actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clínica actualizada correctamente.
 *                 clinica:
 *                   $ref: '#/components/schemas/Clinica'
 *       400:
 *         description: Datos inválidos o body vacío
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorValidacion'
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       403:
 *         description: El usuario no es administrador
 *       404:
 *         description: La clínica no existe o fue eliminada
 *       409:
 *         description: Otra clínica ya tiene ese NIT
 */
router.put(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    validateRequest(actualizarClinicaSchema),
    verificarNitUnico,
    putClinica
);

/**
 * @swagger
 * /api/clinicas/{id}:
 *   delete:
 *     tags: [Clínicas]
 *     summary: Eliminar lógicamente una clínica
 *     description: >
 *       Solo el administrador. No borra el registro: le pone
 *       is_active en false, para conservar el historial de
 *       solicitudes que la referencian.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Clínica eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clínica eliminada correctamente.
 *       400:
 *         description: El id no tiene formato UUID
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       403:
 *         description: El usuario no es administrador
 *       404:
 *         description: La clínica no existe o ya estaba eliminada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", checkRole("administrador"), validateParams(idSchema), deleteClinica);

export default router;
