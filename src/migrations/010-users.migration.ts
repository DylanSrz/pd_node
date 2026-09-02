import { DataTypes, type QueryInterface } from "sequelize";

import { USER_ROLES } from "../types/enums.js";

/**
 * Creates the "users" table, where the people who can access
 * the API are stored (admins and managers).
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

            // Two users cannot share the same email.
            unique: true,
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            // ENUM only accepts the values of the USER_ROLES list.
            type: DataTypes.ENUM(...USER_ROLES),
            allowNull: false,
        },
        is_active: {
            // Used for the logical deletion: instead of removing
            // the record, it is set to false.
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
 * Undoes the migration: drops the "users" table and the ENUM type
 * that PostgreSQL created for the role column.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.dropTable("users");

    // PostgreSQL stores the ENUM as a separate type,
    // that is why it has to be removed by hand.
    await context.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
}
