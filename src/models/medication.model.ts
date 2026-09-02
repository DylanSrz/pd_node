import { DataTypes, Model } from "sequelize";

import db from "../config/db.js";

/**
 * Medication or medical supply from the company catalog.
 * The available quantity does not live here but in the inventory table,
 * because the same medication can be stored in several warehouses.
 */
class Medication extends Model {
    // Unique identifier of the medication.
    declare id: string;

    // Name of the medication.
    declare name: string;

    // Short description of what it is used for.
    declare description: string;

    // Way in which it is packaged. Example: "Caja x 30 tabletas".
    declare presentation: string;

    // Laboratory that manufactures it.
    declare laboratory: string;

    // Set to false when the medication is logically deleted.
    declare is_active: boolean;

    declare createdAt: Date;
    declare updatedAt: Date;
}

Medication.init(
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
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        presentation: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        laboratory: {
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
        tableName: "medications",
        timestamps: true,
    }
);

export default Medication;
