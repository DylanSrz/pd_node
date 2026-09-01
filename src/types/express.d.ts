import type { PayloadToken } from "./payload-token.js";

// Le agregamos la propiedad "user" al Request de Express.
//
// Así, después de pasar por el middleware verifyToken,
// podemos escribir req.user con tipado correcto y sin usar "any".
declare global {
    namespace Express {
        interface Request {
            user?: PayloadToken;
        }
    }
}

// Esta línea le indica a TypeScript que el archivo es un módulo,
// requisito para poder usar "declare global".
export {};
