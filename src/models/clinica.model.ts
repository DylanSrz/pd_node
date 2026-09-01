import { DataTypes, Model } from "sequelize";

import db from "../config/db.js";

/**
 * Clínica o centro de atención que solicita medicamentos.
 * Guarda también los datos de su persona responsable.
 */
class Clinica extends Model {
    // Identificador único de la clínica.
    declare id: string;

    // Nombre comercial de la clínica.
    declare nombre: string;

    // Número de identificación tributaria. No se puede repetir.
    declare nit: string;

    // Dirección física de la clínica.
    declare direccion: string;

    // Teléfono de contacto de la clínica.
    declare telefono: string;

    // Correo de contacto de la clínica.
    declare email: string;

    // Nombre de la persona responsable de la clínica.
    declare responsable_nombre: string;

    // Correo de la persona responsable.
    declare responsable_email: string;

    // Teléfono de la persona responsable.
    declare responsable_telefono: string;

    // Se pone en false cuando la clínica se elimina lógicamente.
    declare is_active: boolean;

    declare createdAt: Date;
    declare updatedAt: Date;
}

Clinica.init(
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
        nit: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        direccion: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        responsable_nombre: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        responsable_email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        responsable_telefono: {
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
        tableName: "clinicas",
        timestamps: true,
    }
);

export default Clinica;
