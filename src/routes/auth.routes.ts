import { Router } from "express";

import { login, register } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate_request.js";
import { loginSchema, registerSchema } from "../dto/auth.schema.js";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Autenticación]
 *     summary: Registrar un usuario nuevo
 *     description: >
 *       Crea un usuario y devuelve sus datos sin la contraseña.
 *       Es el único endpoint que no exige token, y el propio usuario
 *       elige con qué rol se registra.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, email, password, role]
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Dylan
 *               last_name:
 *                 type: string
 *                 example: Suárez
 *               email:
 *                 type: string
 *                 example: dylan.suarez@riwimedicare.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: admin1234
 *               role:
 *                 type: string
 *                 enum: [administrador, gestor]
 *                 example: administrador
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario registrado correctamente.
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos inválidos o incompletos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorValidacion'
 *       409:
 *         description: Ya existe un usuario con ese correo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Ruta pública: no lleva verifyToken porque todavía no existe
// el usuario que pediría el token.
router.post("/register", validateRequest(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Autenticación]
 *     summary: Iniciar sesión y obtener el token
 *     description: >
 *       Valida el correo y la contraseña y devuelve el JSON Web Token
 *       con el que se accede al resto de endpoints. Copie el valor de
 *       "token" y péguelo en el botón Authorize.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: dylan.suarez@riwimedicare.com
 *               password:
 *                 type: string
 *                 example: admin1234
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inicio de sesión exitoso.
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos inválidos o incompletos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorValidacion'
 *       401:
 *         description: Correo o contraseña incorrectos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// También es pública: es justamente la ruta que entrega el token.
router.post("/login", validateRequest(loginSchema), login);

export default router;
