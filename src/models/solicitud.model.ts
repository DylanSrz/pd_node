import { DataTypes, Model } from "sequelize";

import db from "../config/db.js";
import { ESTADOS_SOLICITUD, type EstadoSolicitud } from "../types/enums.js";

/**
 * Solicitud de abastecimiento: una clínica pide una cantidad
 * de un medicamento a un almacén determinado.
 */
class Solicitud extends Model {
    // Identificador único de la solicitud.
    declare id: string;

    // Clínica que hace la solicitud.
    declare clinica_id: string;

    // Medicamento que se está pidiendo.
    declare medicamento_id: string;

    // Almacén al que se le asigna la solicitud.
    declare almacen_id: string;

    // Usuario que registró la solicitud.
    declare usuario_id: string;

    // Unidades pedidas. Siempre mayor que cero.
    declare cantidad_solicitada: number;

    // Estado actual dentro del ciclo de vida de la solicitud.
    declare estado: EstadoSolicitud;

    // Nota opcional que se puede dejar al cambiar el estado.
    declare observaciones: string | null;

    // Se pone en false cuando la solicitud se elimina lógicamente.
    declare is_active: boolean;

    declare createdAt: Date;
    declare updatedAt: Date;
}

Solicitud.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        clinica_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        medicamento_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        almacen_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        usuario_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        cantidad_solicitada: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        estado: {
            type: DataTypes.ENUM(...ESTADOS_SOLICITUD),
            allowNull: false,

            // Toda solicitud nace en estado pendiente.
            defaultValue: "pendiente",
        },
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize: db,
        tableName: "solicitudes",
        timestamps: true,
    }
);

export default Solicitud;
