import { Router } from "express";

import {
    deleteSolicitud,
    getHistorialSolicitudes,
    getSolicitudPorId,
    getSolicitudes,
    patchEstadoSolicitud,
    postSolicitud,
    putSolicitud,
} from "../controllers/solicitud.controller.js";
import { checkRole, verifyToken } from "../middlewares/verifyToken.js";
import { validateParams, validateRequest } from "../middlewares/validate_request.js";
import { verificarEntidadesRelacionadas } from "../middlewares/verificar-entidades-relacionadas.js";
import { verificarInventarioDisponible } from "../middlewares/verificar-inventario.js";
import { verificarTransicionEstado } from "../middlewares/verificar-transicion-estado.js";
import {
    actualizarSolicitudSchema,
    cambiarEstadoSchema,
    crearSolicitudSchema,
} from "../dto/solicitud.schema.js";
import { idSchema } from "../dto/id.schema.js";

const router = Router();

// Todas las rutas de solicitudes exigen token.
router.use(verifyToken);

/**
 * @swagger
 * /api/solicitudes:
 *   get:
 *     tags: [Solicitudes]
 *     summary: Listar las solicitudes activas
 *     description: >
 *       Devuelve las solicitudes que siguen en curso, es decir, las
 *       que están en estado pendiente o aprobada. Las rechazadas,
 *       entregadas y canceladas ya terminaron su ciclo y se consultan
 *       en el historial. Abierto a cualquier usuario autenticado.
 *     responses:
 *       200:
 *         description: Solicitudes activas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Solicitudes activas encontradas.
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 solicitudes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Solicitud'
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getSolicitudes);

/**
 * @swagger
 * /api/solicitudes/historial:
 *   get:
 *     tags: [Solicitudes]
 *     summary: Consultar el historial completo de solicitudes
 *     description: >
 *       Devuelve todas las solicitudes registradas, en cualquier
 *       estado, incluidas las eliminadas lógicamente. Abierto a
 *       cualquier usuario autenticado.
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
 *                   example: Historial de solicitudes encontrado.
 *                 total:
 *                   type: integer
 *                   example: 6
 *                 solicitudes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Solicitud'
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Va declarada ANTES que /:id. Si estuviera después, Express
// interpretaría la palabra "historial" como si fuera un id.
router.get("/historial", getHistorialSolicitudes);

/**
 * @swagger
 * /api/solicitudes/{id}:
 *   get:
 *     tags: [Solicitudes]
 *     summary: Consultar una solicitud
 *     description: >
 *       Devuelve la solicitud con los datos de la clínica, el
 *       medicamento, el almacén y el usuario que la registró.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Solicitud encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Solicitud encontrada.
 *                 solicitud:
 *                   $ref: '#/components/schemas/Solicitud'
 *       400:
 *         description: El id no tiene formato UUID
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       404:
 *         description: La solicitud no existe o fue eliminada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateParams(idSchema), getSolicitudPorId);

/**
 * @swagger
 * /api/solicitudes:
 *   post:
 *     tags: [Solicitudes]
 *     summary: Registrar una solicitud de abastecimiento
 *     description: >
 *       La registran el gestor de solicitudes y el administrador.
 *       El usuario que la crea se toma del token, no del body, para
 *       que nadie pueda registrarla a nombre de otra persona, y el
 *       estado inicial siempre es "pendiente".
 *
 *       Antes de crearla se revisa, en este orden: que los datos
 *       tengan el formato correcto y la cantidad sea mayor que cero,
 *       que la clínica, el medicamento y el almacén existan, y que el
 *       almacén tenga inventario suficiente. El inventario todavía no
 *       se descuenta: eso ocurre al aprobar la solicitud.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clinica_id, medicamento_id, almacen_id, cantidad_solicitada]
 *             properties:
 *               clinica_id:
 *                 type: string
 *                 format: uuid
 *               medicamento_id:
 *                 type: string
 *                 format: uuid
 *               almacen_id:
 *                 type: string
 *                 format: uuid
 *               cantidad_solicitada:
 *                 type: integer
 *                 minimum: 1
 *                 example: 100
 *               observaciones:
 *                 type: string
 *                 example: Pedido mensual de analgésicos.
 *     responses:
 *       201:
 *         description: Solicitud registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Solicitud registrada correctamente.
 *                 solicitud:
 *                   $ref: '#/components/schemas/Solicitud'
 *       400:
 *         description: >
 *           Cantidad menor o igual a cero, el almacén no maneja ese
 *           medicamento, o no tiene inventario suficiente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El almacén no tiene inventario suficiente de ese medicamento.
 *                 cantidad_solicitada:
 *                   type: integer
 *                   example: 500
 *                 cantidad_disponible:
 *                   type: integer
 *                   example: 100
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       403:
 *         description: El usuario no tiene un rol permitido
 *       404:
 *         description: La clínica, el medicamento o el almacén no existen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Antes de crearla se revisa, en este orden:
//   1. que los datos tengan el formato correcto y la cantidad sea > 0,
//   2. que la clínica, el medicamento y el almacén existan,
//   3. que el almacén tenga inventario suficiente.
router.post(
    "/",
    checkRole("gestor", "administrador"),
    validateRequest(crearSolicitudSchema),
    verificarEntidadesRelacionadas,
    verificarInventarioDisponible,
    postSolicitud
);

/**
 * @swagger
 * /api/solicitudes/{id}/estado:
 *   patch:
 *     tags: [Solicitudes]
 *     summary: Cambiar el estado de una solicitud
 *     description: >
 *       Solo se aceptan los cambios de estado que tienen sentido:
 *
 *       - pendiente puede pasar a aprobada, rechazada o cancelada
 *       - aprobada puede pasar a entregada o cancelada
 *       - rechazada, entregada y cancelada son estados finales
 *
 *       Al pasar a "aprobada" se descuentan las unidades del almacén.
 *       Al cancelar una solicitud que estaba aprobada, se devuelven.
 *       Todo se hace dentro de una transacción.
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
 *             required: [estado]
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, aprobada, rechazada, entregada, cancelada]
 *                 example: aprobada
 *               observaciones:
 *                 type: string
 *                 example: Aprobada por el administrador.
 *     responses:
 *       200:
 *         description: Estado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Estado de la solicitud actualizado a 'aprobada'.
 *                 solicitud:
 *                   $ref: '#/components/schemas/Solicitud'
 *       400:
 *         description: Transición de estado no permitida o inventario insuficiente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se puede pasar de 'pendiente' a 'entregada'.
 *                 estado_actual:
 *                   type: string
 *                   example: pendiente
 *                 estados_permitidos:
 *                   type: string
 *                   example: aprobada, rechazada, cancelada
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       403:
 *         description: El usuario no tiene un rol permitido
 *       404:
 *         description: La solicitud no existe o fue eliminada
 */
// verificarTransicionEstado rechaza los saltos que no tienen sentido,
// por ejemplo de pendiente a entregada.
router.patch(
    "/:id/estado",
    checkRole("gestor", "administrador"),
    validateParams(idSchema),
    validateRequest(cambiarEstadoSchema),
    verificarTransicionEstado,
    patchEstadoSolicitud
);

/**
 * @swagger
 * /api/solicitudes/{id}:
 *   put:
 *     tags: [Solicitudes]
 *     summary: Corregir la cantidad o las observaciones
 *     description: >
 *       Solo el administrador, y solo mientras la solicitud siga
 *       pendiente: una vez aprobada ya se descontó el inventario, y
 *       cambiarle la cantidad dejaría el stock descuadrado.
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
 *               cantidad_solicitada:
 *                 type: integer
 *                 minimum: 1
 *                 example: 80
 *               observaciones:
 *                 type: string
 *     responses:
 *       200:
 *         description: Solicitud actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Solicitud actualizada correctamente.
 *                 solicitud:
 *                   $ref: '#/components/schemas/Solicitud'
 *       400:
 *         description: Datos inválidos, body vacío o inventario insuficiente
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       403:
 *         description: El usuario no es administrador
 *       404:
 *         description: La solicitud no existe o fue eliminada
 *       409:
 *         description: La solicitud ya no está pendiente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    validateRequest(actualizarSolicitudSchema),
    putSolicitud
);

/**
 * @swagger
 * /api/solicitudes/{id}:
 *   delete:
 *     tags: [Solicitudes]
 *     summary: Eliminar lógicamente una solicitud
 *     description: >
 *       Solo el administrador. Le pone is_active en false. Si la
 *       solicitud estaba aprobada, devuelve al almacén las unidades
 *       que se le habían descontado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Solicitud eliminada correctamente
 *       400:
 *         description: El id no tiene formato UUID
 *       401:
 *         description: Token no proporcionado, inválido o expirado
 *       403:
 *         description: El usuario no es administrador
 *       404:
 *         description: La solicitud no existe o ya estaba eliminada
 */
router.delete(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    deleteSolicitud
);

export default router;
