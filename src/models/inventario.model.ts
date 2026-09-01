import { DataTypes, Model } from "sequelize";

import db from "../config/db.js";

/**
 * Inventario: cuántas unidades de un medicamento
 * hay disponibles en un almacén.
 *
 * Es la tabla que se consulta antes de aprobar una solicitud
 * y la que se descuenta cuando la solicitud se aprueba.
 */
class Inventario extends Model {
    // Identificador único del registro de inventario.
    declare id: string;

    // Almacén donde está guardado el medicamento.
    declare almacen_id: string;

    // Medicamento del que se lleva la cuenta.
    declare medicamento_id: string;

    // Unidades disponibles. Nunca puede ser negativa.
    declare cantidad: number;

    // Se pone en false cuando el registro se elimina lógicamente.
    declare is_active: boolean;

    declare createdAt: Date;
    declare updatedAt: Date;
}

Inventario.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        almacen_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        medicamento_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize: db,
        tableName: "inventario",
        timestamps: true,
    }
);

export default Inventario;
