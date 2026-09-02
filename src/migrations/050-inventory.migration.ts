import { DataTypes, type QueryInterface } from "sequelize";

/**
 * Creates the "inventory" table, which tells how many units
 * of each medication there are in each warehouse.
 *
 * It is an intermediate table between warehouses and medications:
 * the same medication can be stored in several warehouses
 * with different quantities.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    await context.createTable("inventory", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        warehouse_id: {
            type: DataTypes.UUID,
            allowNull: false,

            // Foreign key: inventory.warehouse_id -> warehouses.id
            references: {
                model: "warehouses",
                key: "id",
            },
        },
        medication_id: {
            type: DataTypes.UUID,
            allowNull: false,

            // Foreign key: inventory.medication_id -> medications.id
            references: {
                model: "medications",
                key: "id",
            },
        },
        quantity: {
            // Available units of that medication in that warehouse.
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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

    // Prevents registering the same medication twice
    // in the same warehouse.
    await context.addConstraint("inventory", {
        fields: ["warehouse_id", "medication_id"],
        type: "unique",
        name: "inventory_warehouse_medication_unique",
    });

    // Rule inside the database itself so that the quantity
    // can never end up being negative.
    await context.sequelize.query(`
        ALTER TABLE inventory
        ADD CONSTRAINT inventory_quantity_not_negative
        CHECK (quantity >= 0);
    `);
}

/**
 * Undoes the migration by dropping the "inventory" table.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.dropTable("inventory");
}
