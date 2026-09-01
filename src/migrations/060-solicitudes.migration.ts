import { DataTypes, type QueryInterface } from "sequelize";

import { ESTADOS_SOLICITUD } from "../types/enums.js";

/**
 * Crea la tabla "solicitudes", el centro del sistema:
 * una clínica pide una cantidad de un medicamento
 * a un almacén determinado.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    await context.createTable("solicitudes", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        clinica_id: {
            type: DataTypes.UUID,
            allowNull: false,

            // Llave foránea: solicitudes.clinica_id -> clinicas.id
            references: {
                model: "clinicas",
                key: "id",
            },
        },
        medicamento_id: {
            type: DataTypes.UUID,
            allowNull: false,

            // Llave foránea: solicitudes.medicamento_id -> medicamentos.id
            references: {
                model: "medicamentos",
                key: "id",
            },
        },
        almacen_id: {
            type: DataTypes.UUID,
            allowNull: false,

            // Llave foránea: solicitudes.almacen_id -> almacenes.id
            references: {
                model: "almacenes",
                key: "id",
            },
        },
        usuario_id: {
            type: DataTypes.UUID,
            allowNull: false,

            // Usuario que registró la solicitud.
            // Llave foránea: solicitudes.usuario_id -> users.id
            references: {
                model: "users",
                key: "id",
            },
        },
        cantidad_solicitada: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        estado: {
            // ENUM solo acepta los valores de la lista ESTADOS_SOLICITUD.
            type: DataTypes.ENUM(...ESTADOS_SOLICITUD),
            allowNull: false,
            defaultValue: "pendiente",
        },
        observaciones: {
            // Campo opcional para dejar una nota al cambiar el estado.
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });

    // Regla en la base de datos: no se aceptan cantidades
    // menores o iguales a cero.
    await context.sequelize.query(`
        ALTER TABLE solicitudes
        ADD CONSTRAINT solicitudes_cantidad_mayor_a_cero
        CHECK (cantidad_solicitada > 0);
    `);
}

/**
 * Deshace la migración: borra la tabla "solicitudes"
 * y el tipo ENUM que PostgreSQL creó para la columna estado.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.dropTable("solicitudes");

    await context.sequelize.query('DROP TYPE IF EXISTS "enum_solicitudes_estado";');
}
