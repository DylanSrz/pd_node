import { DataTypes, Model } from "sequelize";

import db from "../config/db.js";

/**
 * Inventory: how many units of a medication
 * are available in a warehouse.
 *
 * It is the table that is checked before approving a request
 * and the one that is discounted when the request is approved.
 */
class Inventory extends Model {
    // Unique identifier of the inventory record.
    declare id: string;

    // Warehouse where the medication is stored.
    declare warehouse_id: string;

    // Medication being tracked.
    declare medication_id: string;

    // Available units. It can never be negative.
    declare quantity: number;

    // Set to false when the record is logically deleted.
    declare is_active: boolean;

    declare createdAt: Date;
    declare updatedAt: Date;
}

Inventory.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        warehouse_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        medication_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        quantity: {
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
        tableName: "inventory",
        timestamps: true,
    }
);

export default Inventory;
