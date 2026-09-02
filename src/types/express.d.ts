import type { PayloadToken } from "./payload-token.js";

// We add the "user" property to the Express Request.
//
// That way, after going through the verifyToken middleware,
// we can write req.user with proper typing and without using "any".
declare global {
    namespace Express {
        interface Request {
            user?: PayloadToken;
        }
    }
}

// This line tells TypeScript that the file is a module,
// a requirement in order to use "declare global".
export {};
