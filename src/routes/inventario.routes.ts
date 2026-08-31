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

// GET /api/inventario
// El gestor necesita consultarlo para saber qué puede pedir.
router.get("/", getInventario);

// GET /api/inventario/:id
router.get("/:id", validateParams(idSchema), getInventarioPorId);

// POST /api/inventario
router.post(
    "/",
    checkRole("administrador"),
    validateRequest(crearInventarioSchema),
    postInventario
);

// PUT /api/inventario/:id
router.put(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    validateRequest(actualizarInventarioSchema),
    putInventario
);

// DELETE /api/inventario/:id
router.delete(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    deleteInventario
);

export default router;
