import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import type { UserRole } from "../types/enums.js";
import type { PayloadToken } from "../types/payload-token.js";

/**
 * Checks that the request carries a valid JSON Web Token.
 *
 * The token is sent in the Authorization header with the format:
 *   Authorization: Bearer <token>
 *
 * If the token is good, it stores the user data in req.user
 * so the next middlewares and the controller can use it.
 */
export function verifyToken(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;

    // Without an Authorization header there is nothing to validate.
    if (!header || !header.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token not provided." });
        return;
    }

    // The header comes as "Bearer abc.def.ghi",
    // so we keep the second part.
    const token = header.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Token not provided." });
        return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        res.status(500).json({ message: "JWT_SECRET is not configured." });
        return;
    }

    try {
        // jwt.verify checks the signature and that the token is not expired.
        const payload = jwt.verify(token, secret) as PayloadToken;

        // The user is stored in the request to reuse it later.
        req.user = payload;

        next();
    } catch {
        res.status(401).json({ message: "Invalid or expired token." });
    }
}

/**
 * Checks that the user of the token has one of the allowed roles.
 *
 * It is always used after verifyToken, for example:
 *   router.post("/", verifyToken, checkRole("admin"), postClinic)
 *
 * @param allowedRoles Roles that are allowed to run the action.
 */
export function checkRole(...allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.user;

        // If there is no user it is because it did not go through verifyToken.
        if (!user) {
            res.status(401).json({ message: "User not authenticated." });
            return;
        }

        // The role of the token is compared against the list of allowed roles.
        if (!allowedRoles.includes(user.role)) {
            res.status(403).json({
                message: "You do not have permission to perform this action.",
            });
            return;
        }

        next();
    };
}
