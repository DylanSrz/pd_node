import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import type { RolUsuario } from "../types/enums.js";
import type { PayloadToken } from "../types/payload-token.js";

/**
 * Revisa que la petición traiga un JSON Web Token válido.
 *
 * El token se manda en la cabecera Authorization con el formato:
 *   Authorization: Bearer <token>
 *
 * Si el token sirve, guarda los datos del usuario en req.user
 * para que los siguientes middlewares y el controlador puedan usarlos.
 */
export function verifyToken(req: Request, res: Response, next: NextFunction): void {
    const cabecera = req.headers.authorization;

    // Sin cabecera Authorization no hay nada que validar.
    if (!cabecera || !cabecera.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token no proporcionado." });
        return;
    }

    // La cabecera viene como "Bearer abc.def.ghi",
    // así que nos quedamos con la segunda parte.
    const token = cabecera.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Token no proporcionado." });
        return;
    }

    const secreto = process.env.JWT_SECRET;

    if (!secreto) {
        res.status(500).json({ message: "Falta configurar JWT_SECRET." });
        return;
    }

    try {
        // jwt.verify revisa la firma y que el token no esté vencido.
        const payload = jwt.verify(token, secreto) as PayloadToken;

        // Se guarda el usuario en la petición para reutilizarlo después.
        req.user = payload;

        next();
    } catch {
        res.status(401).json({ message: "Token inválido o expirado." });
    }
}

/**
 * Revisa que el usuario del token tenga alguno de los roles permitidos.
 *
 * Se usa siempre después de verifyToken, por ejemplo:
 *   router.post("/", verifyToken, checkRole("administrador"), crearClinica)
 *
 * @param rolesPermitidos Roles que sí pueden ejecutar la acción.
 */
export function checkRole(...rolesPermitidos: RolUsuario[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const usuario = req.user;

        // Si no hay usuario es porque no pasó por verifyToken.
        if (!usuario) {
            res.status(401).json({ message: "Usuario no autenticado." });
            return;
        }

        // Se compara el rol del token contra la lista de roles permitidos.
        if (!rolesPermitidos.includes(usuario.role)) {
            res.status(403).json({
                message: "No tiene permisos para realizar esta acción.",
            });
            return;
        }

        next();
    };
}
