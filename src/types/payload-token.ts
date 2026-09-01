import type { RolUsuario } from "./enums.js";

/**
 * Información que viaja dentro del JSON Web Token.
 *
 * Es lo que guardamos al hacer login y lo que leemos
 * al validar el token en cada petición protegida.
 */
export interface PayloadToken {
    // Id del usuario dueño del token.
    id: string;

    // Correo del usuario.
    email: string;

    // Rol del usuario, para saber qué acciones puede ejecutar.
    role: RolUsuario;
}
