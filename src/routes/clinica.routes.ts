import { Router } from "express";

import {
    deleteClinica,
    getClinicaPorId,
    getClinicas,
    postClinica,
    putClinica,
} from "../controllers/clinica.controller.js";
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

// GET /api/clinicas
// Consulta abierta a cualquier usuario autenticado.
router.get("/", getClinicas);

// GET /api/clinicas/:id
router.get("/:id", validateParams(idSchema), getClinicaPorId);

// POST /api/clinicas
// Solo el administrador. Antes de crear se revisa que el NIT no exista.
router.post(
    "/",
    checkRole("administrador"),
    validateRequest(crearClinicaSchema),
    verificarNitUnico,
    postClinica
);

// PUT /api/clinicas/:id
// Solo el administrador. Si se cambia el NIT, también se revisa
// que no choque con el de otra clínica.
router.put(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    validateRequest(actualizarClinicaSchema),
    verificarNitUnico,
    putClinica
);

// DELETE /api/clinicas/:id
// Solo el administrador. Es una eliminación lógica.
router.delete("/:id", checkRole("administrador"), validateParams(idSchema), deleteClinica);

export default router;
