import { DataTypes, Model } from "sequelize";

import db from "../config/db.js";

/**
 * Warehouse from which the medications are dispatched
 * towards the clinics.
 */
class Warehouse extends Model {
    // Unique identifier of the warehouse.
    declare id: string;

    // Name of the warehouse.
    declare name: string;

    // Physical address of the warehouse.
    declare address: string;

    // Contact phone of the warehouse.
    declare phone: string;

    // Set to false when the warehouse is logically deleted.
    declare is_active: boolean;

    declare createdAt: Date;
    declare updatedAt: Date;
}

Warehouse.init(
    {
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
    },
    {
        sequelize: db,
        tableName: "warehouses",
        timestamps: true,
    }
);

export default Warehouse;
