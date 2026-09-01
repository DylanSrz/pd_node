import { DataTypes, Model } from "sequelize";

import db from "../config/db.js";

/**
 * Almacén desde el que se despachan los medicamentos
 * hacia las clínicas.
 */
class Almacen extends Model {
    // Identificador único del almacén.
    declare id: string;

    // Nombre del almacén.
    declare nombre: string;

    // Dirección física del almacén.
    declare direccion: string;

    // Teléfono de contacto del almacén.
    declare telefono: string;

    // Se pone en false cuando el almacén se elimina lógicamente.
    declare is_active: boolean;

    declare createdAt: Date;
    declare updatedAt: Date;
}

Almacen.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        direccion: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize: db,
        tableName: "almacenes",
        timestamps: true,
    }
);

export default Almacen;
