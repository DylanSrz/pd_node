import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";

import { User } from "../models/index.js";
import type { LoginInput, RegisterInput } from "../dto/auth.schema.js";
import type { PayloadToken } from "../types/payload-token.js";
import { HttpError } from "../utils/http-error.js";

/**
 * Datos públicos de un usuario.
 * Se usa para responder sin exponer nunca el password_hash.
 */
interface UsuarioPublico {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: PayloadToken["role"];
    is_active: boolean;
}

/**
 * Arma el objeto que se le devuelve al cliente a partir de un usuario,
 * dejando por fuera la contraseña.
 *
 * @param usuario Usuario tal como viene de la base de datos.
 */
function armarUsuarioPublico(usuario: User): UsuarioPublico {
    return {
        id: usuario.id,
        first_name: usuario.first_name,
        last_name: usuario.last_name,
        email: usuario.email,
        role: usuario.role,
        is_active: usuario.is_active,
    };
}

/**
 * Registra un usuario nuevo.
 *
 * La contraseña no se cifra aquí: el hook beforeCreate del modelo User
 * la convierte en hash con bcrypt justo antes de guardarla.
 *
 * @param datos Datos ya validados por registerSchema.
 * @returns El usuario creado, sin la contraseña.
 */
export async function registrarUsuario(datos: RegisterInput): Promise<UsuarioPublico> {
    // El correo se guarda en minúsculas, así que se busca en minúsculas
    // para no permitir dos cuentas con el mismo correo escrito distinto.
    const correo = datos.email.toLowerCase();

    const usuarioExistente = await User.findOne({ where: { email: correo } });

    if (usuarioExistente) {
        throw new HttpError(409, "Ya existe un usuario registrado con ese correo.");
    }

    const nuevoUsuario = await User.create({
        first_name: datos.first_name,
        last_name: datos.last_name,
        email: correo,
        password_hash: datos.password,
        role: datos.role,
    });

    return armarUsuarioPublico(nuevoUsuario);
}

/**
 * Valida las credenciales de un usuario y le entrega un token.
 *
 * @param datos Correo y contraseña ya validados por loginSchema.
 * @returns El token firmado y los datos públicos del usuario.
 */
export async function iniciarSesion(
    datos: LoginInput
): Promise<{ token: string; usuario: UsuarioPublico }> {
    const correo = datos.email.toLowerCase();

    const usuario = await User.findOne({ where: { email: correo } });

    // Se responde el mismo mensaje si el correo no existe o si la
    // contraseña está mala, para no dar pistas de cuál cuenta existe.
    if (!usuario) {
        throw new HttpError(401, "Correo o contraseña incorrectos.");
    }

    // Un usuario eliminado lógicamente no puede entrar.
    if (!usuario.is_active) {
        throw new HttpError(401, "El usuario se encuentra inactivo.");
    }

    // bcrypt.compare cifra la contraseña recibida y la compara
    // con el hash guardado. Nunca se descifra el hash.
    const contrasenaCorrecta = await bcrypt.compare(datos.password, usuario.password_hash);

    if (!contrasenaCorrecta) {
        throw new HttpError(401, "Correo o contraseña incorrectos.");
    }

    const secreto = process.env.JWT_SECRET;

    if (!secreto) {
        throw new HttpError(500, "Falta configurar JWT_SECRET en el archivo .env.");
    }

    // Lo que se guarda dentro del token. No se incluye la contraseña
    // porque el token se puede leer con cualquier herramienta.
    const payload: PayloadToken = {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role,
    };

    // Si no se configuró el tiempo de vida, el token dura 8 horas.
    const tiempoDeVida = process.env.JWT_EXPIRES_IN ?? "8h";

    const opciones: SignOptions = {
        expiresIn: tiempoDeVida as SignOptions["expiresIn"],
    };

    const token = jwt.sign(payload, secreto, opciones);

    return {
        token,
        usuario: armarUsuarioPublico(usuario),
    };
}
