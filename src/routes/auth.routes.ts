import { Router } from "express";

import { login, register } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate-request.js";
import { loginSchema, registerSchema } from "../dto/auth.schema.js";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     description: >
 *       Creates a user and returns their data without the password.
 *       It is the only endpoint that does not require a token, and the
 *       user chooses which role to sign up with.
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
 *                 enum: [admin, manager]
 *                 example: admin
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully.
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid or incomplete data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: A user with that email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Public route: it does not carry verifyToken because the user who
// would ask for the token does not exist yet.
router.post("/register", validateRequest(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Sign in and get the token
 *     description: >
 *       Validates the email and the password and returns the JSON Web
 *       Token used to access the rest of the endpoints. Copy the value
 *       of "token" and paste it into the Authorize button.
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
 *         description: Sign in successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sign in successful.
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid or incomplete data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Wrong email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// It is public too: it is precisely the route that hands out the token.
router.post("/login", validateRequest(loginSchema), login);

export default router;
