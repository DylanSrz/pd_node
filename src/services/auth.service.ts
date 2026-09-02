import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";

import { User } from "../models/index.js";
import type { LoginInput, RegisterInput } from "../dto/auth.schema.js";
import type { PayloadToken } from "../types/payload-token.js";
import { HttpError } from "../utils/http-error.js";

/**
 * Public data of a user.
 * It is used to answer without ever exposing the password_hash.
 */
interface PublicUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: PayloadToken["role"];
    is_active: boolean;
}

/**
 * Builds the object returned to the client out of a user,
 * leaving the password out.
 *
 * @param user User as it comes from the database.
 */
function buildPublicUser(user: User): PublicUser {
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
    };
}

/**
 * Registers a new user.
 *
 * The password is not hashed here: the beforeCreate hook of the User
 * model turns it into a bcrypt hash right before saving it.
 *
 * @param data Data already validated by registerSchema.
 * @returns The created user, without the password.
 */
export async function registerUser(data: RegisterInput): Promise<PublicUser> {
    // The email is stored lowercased, so it is looked up lowercased
    // in order not to allow two accounts with the same email written
    // differently.
    const email = data.email.toLowerCase();

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        throw new HttpError(409, "A user registered with that email already exists.");
    }

    const newUser = await User.create({
        first_name: data.first_name,
        last_name: data.last_name,
        email,
        password_hash: data.password,
        role: data.role,
    });

    return buildPublicUser(newUser);
}

/**
 * Validates the credentials of a user and hands them a token.
 *
 * @param data Email and password already validated by loginSchema.
 * @returns The signed token and the public data of the user.
 */
export async function loginUser(
    data: LoginInput
): Promise<{ token: string; user: PublicUser }> {
    const email = data.email.toLowerCase();

    const user = await User.findOne({ where: { email } });

    // The same message is returned whether the email does not exist or
    // the password is wrong, so as not to hint which account exists.
    if (!user) {
        throw new HttpError(401, "Wrong email or password.");
    }

    // A logically deleted user cannot get in.
    if (!user.is_active) {
        throw new HttpError(401, "The user is inactive.");
    }

    // bcrypt.compare hashes the received password and compares it
    // with the stored hash. The hash is never decrypted.
    const isPasswordCorrect = await bcrypt.compare(data.password, user.password_hash);

    if (!isPasswordCorrect) {
        throw new HttpError(401, "Wrong email or password.");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new HttpError(500, "JWT_SECRET is not configured in the .env file.");
    }

    // What is stored inside the token. The password is not included
    // because the token can be read with any tool.
    const payload: PayloadToken = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    // If the lifetime was not configured, the token lasts 8 hours.
    const lifetime = process.env.JWT_EXPIRES_IN ?? "8h";

    const options: SignOptions = {
        expiresIn: lifetime as SignOptions["expiresIn"],
    };

    const token = jwt.sign(payload, secret, options);

    return {
        token,
        user: buildPublicUser(user),
    };
}
