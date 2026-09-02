import { DataTypes, type QueryInterface } from "sequelize";

/**
 * Creates the "warehouses" table, the depots from which
 * the medications are dispatched towards the clinics.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    await context.createTable("warehouses", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
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
}

/**
 * Undoes the migration by dropping the "warehouses" table.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.dropTable("warehouses");
}
