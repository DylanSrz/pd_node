import { Transaction } from "sequelize";

import db from "../config/db.js";
import {
    Almacen,
    Clinica,
    Inventario,
    Medicamento,
    Solicitud,
    User,
} from "../models/index.js";
import type {
    ActualizarSolicitudInput,
    CambiarEstadoInput,
    CrearSolicitudInput,
} from "../dto/solicitud.schema.js";
import { obtenerClinicaPorId } from "./clinica.service.js";
import { HttpError } from "../utils/http-error.js";

// Al consultar solicitudes siempre se traen los datos de las tablas
// relacionadas, para no devolver una lista de UUIDs sin significado.
const incluirRelaciones = [
    {
        model: Clinica,
        as: "clinica",
        attributes: ["id", "nombre", "nit", "responsable_nombre"],
    },
    {
        model: Medicamento,
        as: "medicamento",
        attributes: ["id", "nombre", "presentacion"],
    },
    {
        model: Almacen,
        as: "almacen",
        attributes: ["id", "nombre"],
    },
    {
        model: User,
        as: "usuario",
        attributes: ["id", "first_name", "last_name", "email"],
    },
];

/**
 * Devuelve las solicitudes activas, es decir, las que todavía
 * están en curso: pendientes o aprobadas.
 *
 * Las rechazadas, entregadas y canceladas ya terminaron su ciclo,
 * así que se consultan en el historial.
 */
export async function listarSolicitudesActivas(): Promise<Solicitud[]> {
    const solicitudes = await Solicitud.findAll({
        where: {
            is_active: true,
            estado: ["pendiente", "aprobada"],
        },
        include: incluirRelaciones,
        order: [["createdAt", "DESC"]],
    });

    return solicitudes;
}

/**
 * Devuelve el historial completo de solicitudes.
 *
 * Aquí no se filtra por estado ni por is_active a propósito:
 * el historial debe mostrar todo lo que ha pasado, incluidas
 * las solicitudes eliminadas lógicamente.
 */
export async function listarHistorialSolicitudes(): Promise<Solicitud[]> {
    const solicitudes = await Solicitud.findAll({
        include: incluirRelaciones,
        order: [["createdAt", "DESC"]],
    });

    return solicitudes;
}

/**
 * Devuelve el historial de solicitudes de una clínica.
 *
 * @param clinicaId Identificador UUID de la clínica.
 * @throws HttpError 404 si la clínica no existe o fue eliminada.
 */
export async function listarSolicitudesPorClinica(
    clinicaId: string
): Promise<Solicitud[]> {
    // Se reutiliza el service de clínicas, que ya lanza el 404.
    await obtenerClinicaPorId(clinicaId);

    const solicitudes = await Solicitud.findAll({
        where: { clinica_id: clinicaId },
        include: incluirRelaciones,
        order: [["createdAt", "DESC"]],
    });

    return solicitudes;
}

/**
 * Busca una solicitud activa por su id.
 *
 * @param id Identificador UUID de la solicitud.
 * @throws HttpError 404 si la solicitud no existe o fue eliminada.
 */
export async function obtenerSolicitudPorId(id: string): Promise<Solicitud> {
    const solicitud = await Solicitud.findOne({
        where: { id, is_active: true },
        include: incluirRelaciones,
    });

    if (!solicitud) {
        throw new HttpError(404, "La solicitud no existe o fue eliminada.");
    }

    return solicitud;
}

/**
 * Registra una solicitud de abastecimiento.
 *
 * Cuando llega aquí, los middlewares ya revisaron que la clínica,
 * el medicamento y el almacén existan, y que haya inventario
 * suficiente. El inventario todavía no se descuenta: eso ocurre
 * cuando la solicitud se aprueba.
 *
 * @param datos Datos ya validados por crearSolicitudSchema.
 * @param usuarioId Id del usuario que hace la solicitud, sacado del token.
 */
export async function crearSolicitud(
    datos: CrearSolicitudInput,
    usuarioId: string
): Promise<Solicitud> {
    const nuevaSolicitud = await Solicitud.create({
        clinica_id: datos.clinica_id,
        medicamento_id: datos.medicamento_id,
        almacen_id: datos.almacen_id,
        usuario_id: usuarioId,
        cantidad_solicitada: datos.cantidad_solicitada,
        observaciones: datos.observaciones ?? null,

        // Toda solicitud nace pendiente.
        estado: "pendiente",
    });

    // Se vuelve a consultar para devolverla con las relaciones incluidas.
    return obtenerSolicitudPorId(nuevaSolicitud.id);
}

/**
 * Cambia el estado de una solicitud y ajusta el inventario.
 *
 * Que el cambio de estado sea válido ya lo revisó el middleware
 * verificarTransicionEstado. Aquí se aplica el efecto sobre el stock:
 *
 * - Al pasar a 'aprobada' se descuentan las unidades del almacén.
 * - Al cancelar una solicitud que estaba aprobada, se devuelven.
 *
 * Todo se hace dentro de una transacción: si algo falla a mitad de
 * camino, no queda el estado cambiado y el inventario sin ajustar.
 *
 * @param id Identificador UUID de la solicitud.
 * @param datos Estado nuevo y observaciones, ya validados.
 */
export async function cambiarEstadoSolicitud(
    id: string,
    datos: CambiarEstadoInput
): Promise<Solicitud> {
    const transaccion = await db.transaction();

    try {
        const solicitud = await Solicitud.findOne({
            where: { id, is_active: true },
            transaction: transaccion,
        });

        if (!solicitud) {
            throw new HttpError(404, "La solicitud no existe o fue eliminada.");
        }

        const estadoAnterior = solicitud.estado;

        // Caso 1: se aprueba la solicitud, hay que descontar el inventario.
        if (datos.estado === "aprobada") {
            const registroInventario = await Inventario.findOne({
                where: {
                    almacen_id: solicitud.almacen_id,
                    medicamento_id: solicitud.medicamento_id,
                    is_active: true,
                },
                transaction: transaccion,

                // Bloquea la fila hasta que termine la transacción, para que
                // dos aprobaciones al mismo tiempo no descuenten el mismo stock.
                lock: Transaction.LOCK.UPDATE,
            });

            if (!registroInventario) {
                throw new HttpError(
                    400,
                    "El almacén ya no maneja ese medicamento, no se puede aprobar."
                );
            }

            // Se vuelve a revisar la cantidad: entre que se creó la solicitud
            // y ahora, otra aprobación pudo haber consumido el inventario.
            if (registroInventario.cantidad < solicitud.cantidad_solicitada) {
                throw new HttpError(
                    400,
                    `Inventario insuficiente para aprobar. Disponible: ${registroInventario.cantidad}, solicitado: ${solicitud.cantidad_solicitada}.`
                );
            }

            await registroInventario.update(
                { cantidad: registroInventario.cantidad - solicitud.cantidad_solicitada },
                { transaction: transaccion }
            );
        }

        // Caso 2: se cancela una solicitud que ya estaba aprobada,
        // hay que devolver las unidades al almacén.
        if (datos.estado === "cancelada" && estadoAnterior === "aprobada") {
            const registroInventario = await Inventario.findOne({
                where: {
                    almacen_id: solicitud.almacen_id,
                    medicamento_id: solicitud.medicamento_id,
                    is_active: true,
                },
                transaction: transaccion,
                lock: Transaction.LOCK.UPDATE,
            });

            if (registroInventario) {
                await registroInventario.update(
                    {
                        cantidad:
                            registroInventario.cantidad + solicitud.cantidad_solicitada,
                    },
                    { transaction: transaccion }
                );
            }
        }

        // Ya ajustado el inventario, se guarda el estado nuevo.
        await solicitud.update(
            {
                estado: datos.estado,
                observaciones: datos.observaciones ?? solicitud.observaciones,
            },
            { transaction: transaccion }
        );

        // commit confirma todos los cambios de la transacción.
        await transaccion.commit();

        return obtenerSolicitudPorId(id);
    } catch (error) {
        // rollback deshace todo lo que se alcanzó a hacer.
        await transaccion.rollback();

        throw error;
    }
}

/**
 * Corrige la cantidad o las observaciones de una solicitud.
 *
 * Solo se permite mientras la solicitud siga pendiente: una vez
 * aprobada ya se descontó el inventario, y cambiarle la cantidad
 * dejaría el stock descuadrado.
 *
 * @param id Identificador UUID de la solicitud.
 * @param datos Campos a modificar, ya validados.
 */
export async function actualizarSolicitud(
    id: string,
    datos: ActualizarSolicitudInput
): Promise<Solicitud> {
    const solicitud = await obtenerSolicitudPorId(id);

    if (solicitud.estado !== "pendiente") {
        throw new HttpError(
            409,
            `Solo se puede modificar una solicitud pendiente. Esta se encuentra en estado '${solicitud.estado}'.`
        );
    }

    // Si se cambia la cantidad, hay que revisar que el almacén
    // siga teniendo existencias suficientes.
    if (datos.cantidad_solicitada !== undefined) {
        const registroInventario = await Inventario.findOne({
            where: {
                almacen_id: solicitud.almacen_id,
                medicamento_id: solicitud.medicamento_id,
                is_active: true,
            },
        });

        if (!registroInventario) {
            throw new HttpError(400, "El almacén ya no maneja ese medicamento.");
        }

        if (registroInventario.cantidad < datos.cantidad_solicitada) {
            throw new HttpError(
                400,
                `El almacén no tiene inventario suficiente. Disponible: ${registroInventario.cantidad}.`
            );
        }
    }

    await solicitud.update(datos);

    return obtenerSolicitudPorId(id);
}

/**
 * Elimina lógicamente una solicitud poniéndole is_active en false.
 *
 * Si la solicitud estaba aprobada, se devuelven al almacén las
 * unidades que se le habían descontado.
 *
 * @param id Identificador UUID de la solicitud.
 */
export async function eliminarSolicitud(id: string): Promise<void> {
    const transaccion = await db.transaction();

    try {
        const solicitud = await Solicitud.findOne({
            where: { id, is_active: true },
            transaction: transaccion,
        });

        if (!solicitud) {
            throw new HttpError(404, "La solicitud no existe o fue eliminada.");
        }

        // Una solicitud aprobada tiene inventario reservado que hay
        // que devolver antes de darla de baja.
        if (solicitud.estado === "aprobada") {
            const registroInventario = await Inventario.findOne({
                where: {
                    almacen_id: solicitud.almacen_id,
                    medicamento_id: solicitud.medicamento_id,
                    is_active: true,
                },
                transaction: transaccion,
                lock: Transaction.LOCK.UPDATE,
            });

            if (registroInventario) {
                await registroInventario.update(
                    {
                        cantidad:
                            registroInventario.cantidad + solicitud.cantidad_solicitada,
                    },
                    { transaction: transaccion }
                );
            }
        }

        await solicitud.update({ is_active: false }, { transaction: transaccion });

        await transaccion.commit();
    } catch (error) {
        await transaccion.rollback();

        throw error;
    }
}
