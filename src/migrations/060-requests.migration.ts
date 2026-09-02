import { DataTypes, type QueryInterface } from "sequelize";

import { REQUEST_STATUSES } from "../types/enums.js";

/**
 * Creates the "requests" table, the core of the system:
 * a clinic asks for a quantity of a medication
 * from a given warehouse.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    await context.createTable("requests", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        clinic_id: {
            type: DataTypes.UUID,
            allowNull: false,

            // Foreign key: requests.clinic_id -> clinics.id
            references: {
                model: "clinics",
                key: "id",
            },
        },
        medication_id: {
            type: DataTypes.UUID,
            allowNull: false,

            // Foreign key: requests.medication_id -> medications.id
            references: {
                model: "medications",
                key: "id",
            },
        },
        warehouse_id: {
            type: DataTypes.UUID,
            allowNull: false,

            // Foreign key: requests.warehouse_id -> warehouses.id
            references: {
                model: "warehouses",
                key: "id",
            },
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,

            // User who registered the request.
            // Foreign key: requests.user_id -> users.id
            references: {
                model: "users",
                key: "id",
            },
        },
        requested_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            // ENUM only accepts the values of the REQUEST_STATUSES list.
            type: DataTypes.ENUM(...REQUEST_STATUSES),
            allowNull: false,
            defaultValue: "pending",
        },
        notes: {
            // Optional field to leave a note when changing the status.
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

    // Rule inside the database: quantities lower than or equal
    // to zero are not accepted.
    await context.sequelize.query(`
        ALTER TABLE requests
        ADD CONSTRAINT requests_quantity_greater_than_zero
        CHECK (requested_quantity > 0);
    `);
}

/**
 * Undoes the migration: drops the "requests" table
 * and the ENUM type that PostgreSQL created for the status column.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.dropTable("requests");

    await context.sequelize.query('DROP TYPE IF EXISTS "enum_requests_status";');
}
