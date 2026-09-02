import { DataTypes, Model } from "sequelize";

import db from "../config/db.js";
import { REQUEST_STATUSES, type RequestStatus } from "../types/enums.js";

/**
 * Supply request: a clinic asks for a quantity
 * of a medication from a given warehouse.
 */
class Request extends Model {
    // Unique identifier of the request.
    declare id: string;

    // Clinic that makes the request.
    declare clinic_id: string;

    // Medication being requested.
    declare medication_id: string;

    // Warehouse the request is assigned to.
    declare warehouse_id: string;

    // User who registered the request.
    declare user_id: string;

    // Requested units. Always greater than zero.
    declare requested_quantity: number;

    // Current status inside the life cycle of the request.
    declare status: RequestStatus;

    // Optional note that can be left when changing the status.
    declare notes: string | null;

    // Set to false when the request is logically deleted.
    declare is_active: boolean;

    declare createdAt: Date;
    declare updatedAt: Date;
}

Request.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        clinic_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        medication_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        warehouse_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        requested_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...REQUEST_STATUSES),
            allowNull: false,

            // Every request is born in the pending status.
            defaultValue: "pending",
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize: db,
        tableName: "requests",
        timestamps: true,
    }
);

export default Request;
