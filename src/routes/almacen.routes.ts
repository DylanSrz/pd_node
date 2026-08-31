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

// GET /api/almacenes
router.get("/", getAlmacenes);

// GET /api/almacenes/:id
router.get("/:id", validateParams(idSchema), getAlmacenPorId);

// POST /api/almacenes
router.post(
    "/",
    checkRole("administrador"),
    validateRequest(crearAlmacenSchema),
    postAlmacen
);

// PUT /api/almacenes/:id
router.put(
    "/:id",
    checkRole("administrador"),
    validateParams(idSchema),
    validateRequest(actualizarAlmacenSchema),
    putAlmacen
);

// DELETE /api/almacenes/:id
router.delete("/:id", checkRole("administrador"), validateParams(idSchema), deleteAlmacen);

export default router;
