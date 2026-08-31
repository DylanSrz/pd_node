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

// GET /api/medicamentos
router.get("/", getMedicamentos);

// GET /api/medicamentos/:id
router.get("/:id", validateParams(idSchema), getMedicamentoPorId);

// POST /api/medicamentos
router.post(
    "/",
    checkRole("administrador"),
    validateRequest(crearMedicamentoSchema),
    postMedicamento
);

// PUT /api/medicamentos/:id
router.put(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    validateRequest(actualizarMedicamentoSchema),
    putMedicamento
);

// DELETE /api/medicamentos/:id
router.delete(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    deleteMedicamento
);

export default router;
