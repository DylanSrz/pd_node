import { DataTypes, Model } from "sequelize";

import db from "../config/db.js";

/**
 * Clinic or care center that requests medications.
 * It also stores the details of the person in charge.
 */
class Clinic extends Model {
    // Unique identifier of the clinic.
    declare id: string;

    // Trade name of the clinic.
    declare name: string;

    // Tax identification number. It cannot be repeated.
    declare tax_id: string;

    // Physical address of the clinic.
    declare address: string;

    // Contact phone of the clinic.
    declare phone: string;

    // Contact email of the clinic.
    declare email: string;

    // Name of the person in charge of the clinic.
    declare manager_name: string;

    // Email of the person in charge.
    declare manager_email: string;

    // Phone of the person in charge.
    declare manager_phone: string;

    // Set to false when the clinic is logically deleted.
    declare is_active: boolean;

    declare createdAt: Date;
    declare updatedAt: Date;
}

Clinic.init(
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
        tax_id: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        address: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        manager_name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        manager_email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        manager_phone: {
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
        tableName: "clinics",
        timestamps: true,
    }
);

export default Clinic;
