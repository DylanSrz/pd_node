import { DataTypes, Model } from "sequelize";

import db from "../config/db.js";

/**
 * Medicamento o insumo médico del catálogo de la empresa.
 * La cantidad disponible no vive aquí, sino en la tabla inventario,
 * porque un mismo medicamento puede estar en varios almacenes.
 */
class Medicamento extends Model {
    // Identificador único del medicamento.
    declare id: string;

    // Nombre del medicamento.
    declare nombre: string;

    // Descripción corta de para qué sirve.
    declare descripcion: string;

    // Forma en la que se presenta. Ejemplo: "Caja x 30 tabletas".
    declare presentacion: string;

    // Laboratorio que lo fabrica.
    declare laboratorio: string;

    // Se pone en false cuando el medicamento se elimina lógicamente.
    declare is_active: boolean;

    declare createdAt: Date;
    declare updatedAt: Date;
}

Medicamento.init(
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
        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        presentacion: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        laboratorio: {
            type: DataTypes.STRING(150),
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
        tableName: "medicamentos",
        timestamps: true,
    }
);

export default Medicamento;
