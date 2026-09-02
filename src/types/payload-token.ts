import type { UserRole } from "./enums.js";

/**
 * Information carried inside the JSON Web Token.
 *
 * It is what we store when logging in and what we read
 * when validating the token on every protected request.
 */
export interface PayloadToken {
    // Id of the user who owns the token.
    id: string;

    // Email of the user.
    email: string;

    // Role of the user, used to know which actions they can run.
    role: UserRole;
}
