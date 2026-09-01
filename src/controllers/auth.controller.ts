import type { NextFunction, Request, Response } from "express";

import { iniciarSesion, registrarUsuario } from "../services/auth.service.js";

/**
 * POST /api/auth/register
 *
 * Registra un usuario nuevo. Es el único endpoint que no pide token,
 * y el usuario elige con qué rol se registra.
 */
export async function register(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // req.body ya viene validado por el middleware validateRequest.
        const usuario = await registrarUsuario(req.body);

        res.status(201).json({
            message: "Usuario registrado correctamente.",
            usuario,
        });
    } catch (error) {
        // next(error) manda el error al middleware errorHandler,
        // que se encarga de armar la respuesta.
        next(error);
    }
}

/**
 * POST /api/auth/login
 *
 * Valida el correo y la contraseña y devuelve el token
 * con el que se acceden al resto de rutas.
 */
export async function login(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const resultado = await iniciarSesion(req.body);

        res.status(200).json({
            message: "Inicio de sesión exitoso.",
            token: resultado.token,
            usuario: resultado.usuario,
        });
    } catch (error) {
        next(error);
    }
}
