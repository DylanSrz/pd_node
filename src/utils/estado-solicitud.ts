import type { EstadoSolicitud } from "../types/enums.js";

/**
 * Mapa con los cambios de estado permitidos.
 *
 * Para cada estado se lista a cuáles puede pasar.
 * Los estados finales tienen la lista vacía: de ahí no se sale.
 *
 *   pendiente ──> aprobada ──> entregada   (final)
 *       │             └──────> cancelada   (final)
 *       ├──────> rechazada                 (final)
 *       └──────> cancelada                 (final)
 */
export const TRANSICIONES_PERMITIDAS: Record<EstadoSolicitud, EstadoSolicitud[]> = {
    pendiente: ["aprobada", "rechazada", "cancelada"],
    aprobada: ["entregada", "cancelada"],
    rechazada: [],
    entregada: [],
    cancelada: [],
};

/**
 * Dice si una solicitud puede pasar de un estado a otro.
 *
 * @param estadoActual Estado en el que está la solicitud ahora.
 * @param estadoNuevo Estado al que se quiere cambiar.
 * @returns true si el cambio está permitido.
 */
export function esTransicionValida(
    estadoActual: EstadoSolicitud,
    estadoNuevo: EstadoSolicitud
): boolean {
    const estadosPosibles = TRANSICIONES_PERMITIDAS[estadoActual];

    return estadosPosibles.includes(estadoNuevo);
}

/**
 * Devuelve, en un texto, los estados a los que sí se puede pasar.
 * Sirve para armar un mensaje de error claro para quien consume la API.
 *
 * @param estadoActual Estado en el que está la solicitud ahora.
 */
export function estadosPosiblesComoTexto(estadoActual: EstadoSolicitud): string {
    const estadosPosibles = TRANSICIONES_PERMITIDAS[estadoActual];

    if (estadosPosibles.length === 0) {
        return "ninguno, porque es un estado final";
    }

    return estadosPosibles.join(", ");
}
