/**
 * Roles que puede tener un usuario dentro del sistema.
 *
 * - administrador: puede hacer el CRUD completo de todas las entidades.
 * - gestor: solo puede registrar solicitudes y cambiarles el estado.
 */
export const ROLES_USUARIO = ["administrador", "gestor"] as const;

// Crea el tipo "administrador" | "gestor" a partir del arreglo de arriba,
// para no tener que escribir los roles dos veces.
export type RolUsuario = (typeof ROLES_USUARIO)[number];

/**
 * Estados por los que puede pasar una solicitud de abastecimiento.
 *
 * - pendiente: estado inicial, apenas la crea el gestor.
 * - aprobada: el administrador la aprobó y ya se descontó el inventario.
 * - rechazada: el administrador la rechazó.
 * - entregada: el medicamento llegó a la clínica.
 * - cancelada: se anuló la solicitud.
 */
export const ESTADOS_SOLICITUD = [
    "pendiente",
    "aprobada",
    "rechazada",
    "entregada",
    "cancelada",
] as const;

export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[number];
