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

// GET /api/solicitudes
// Solicitudes en curso. Abierto a cualquier usuario autenticado.
router.get("/", getSolicitudes);

// GET /api/solicitudes/historial
// Va declarada ANTES que /:id. Si estuviera después, Express
// interpretaría la palabra "historial" como si fuera un id.
router.get("/historial", getHistorialSolicitudes);

// GET /api/solicitudes/:id
router.get("/:id", validateParams(idSchema), getSolicitudPorId);

// POST /api/solicitudes
// La registra el gestor de solicitudes; el administrador también puede.
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

// PATCH /api/solicitudes/:id/estado
// Cambia el estado. verificarTransicionEstado rechaza los saltos
// que no tienen sentido, por ejemplo de pendiente a entregada.
router.patch(
    "/:id/estado",
    checkRole("gestor", "administrador"),
    validateParams(idSchema),
    validateRequest(cambiarEstadoSchema),
    verificarTransicionEstado,
    patchEstadoSolicitud
);

// PUT /api/solicitudes/:id
// Solo el administrador, y solo mientras la solicitud siga pendiente.
router.put(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    validateRequest(actualizarSolicitudSchema),
    putSolicitud
);

// DELETE /api/solicitudes/:id
// Solo el administrador. Es una eliminación lógica.
router.delete(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    deleteSolicitud
);

export default router;
