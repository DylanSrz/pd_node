import { Router } from "express";

import { login, register } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate_request.js";
import { loginSchema, registerSchema } from "../dto/auth.schema.js";

const router = Router();

// POST /api/auth/register
// Registro de usuarios. Ruta pública: no lleva verifyToken porque
// todavía no existe el usuario que pediría el token.
router.post("/register", validateRequest(registerSchema), register);

// POST /api/auth/login
// Inicio de sesión. También es pública: es la ruta que entrega el token.
router.post("/login", validateRequest(loginSchema), login);

export default router;
