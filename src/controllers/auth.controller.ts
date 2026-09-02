import type { NextFunction, Request, Response } from "express";

import { loginUser, registerUser } from "../services/auth.service.js";

/**
 * POST /api/auth/register
 *
 * Registers a new user. It is the only endpoint that does not ask for
 * a token, and the user chooses which role to sign up with.
 */
export async function register(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // req.body already comes validated by the validateRequest middleware.
        const user = await registerUser(req.body);

        res.status(201).json({
            message: "User registered successfully.",
            user,
        });
    } catch (error) {
        // next(error) sends the error to the errorHandler middleware,
        // which takes care of building the response.
        next(error);
    }
}

/**
 * POST /api/auth/login
 *
 * Validates the email and the password and returns the token
 * used to access the rest of the routes.
 */
export async function login(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await loginUser(req.body);

        res.status(200).json({
            message: "Sign in successful.",
            token: result.token,
            user: result.user,
        });
    } catch (error) {
        next(error);
    }
}
