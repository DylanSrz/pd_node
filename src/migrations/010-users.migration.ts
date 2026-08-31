import { DataTypes, type QueryInterface } from "sequelize";

import { ROLES_USUARIO } from "../types/enums.js";

/**
 * Crea la tabla "users", donde se guardan las personas
 * que pueden entrar a la API (administradores y gestores).
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    await context.createTable("users", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,

            // No pueden existir dos usuarios con el mismo correo.
            unique: true,
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            // ENUM solo acepta los valores de la lista ROLES_USUARIO.
            type: DataTypes.ENUM(...ROLES_USUARIO),
            allowNull: false,
        },
        is_active: {
            // Se usa para la eliminación lógica: en vez de borrar
            // el registro, se pone en false.
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
}

/**
 * Deshace la migración: borra la tabla "users" y el tipo ENUM
 * que PostgreSQL creó para la columna role.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.dropTable("users");

    // PostgreSQL guarda los ENUM como un tipo aparte,
    // por eso hay que eliminarlo a mano.
    await context.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
}
