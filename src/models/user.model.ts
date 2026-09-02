import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";

import db from "../config/db.js";
import { USER_ROLES, type UserRole } from "../types/enums.js";

/**
 * User who can authenticate against the API.
 * Can be an admin or a request manager.
 */
class User extends Model {
    // Unique identifier of the user.
    declare id: string;

    // First name of the user.
    declare first_name: string;

    // Last name of the user.
    declare last_name: string;

    // Email used to sign in. It cannot be repeated.
    declare email: string;

    // Password stored hashed with bcrypt, never in plain text.
    declare password_hash: string;

    // Role that defines what they can do inside the system.
    declare role: UserRole;

    // Set to false when the user is logically deleted.
    declare is_active: boolean;

    // Dates that Sequelize manages on its own.
    declare createdAt: Date;
    declare updatedAt: Date;
}

User.init(
    {
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
            unique: true,

            // Checks that the text has the shape of an email address.
            validate: {
                isEmail: true,
            },
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(...USER_ROLES),
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
        tableName: "users",
        timestamps: true,
    }
);

// Before saving a new user:
// the texts are lowercased and the password is hashed.
User.beforeCreate(async (user: User) => {
    user.first_name = user.first_name.toLowerCase();
    user.last_name = user.last_name.toLowerCase();
    user.email = user.email.toLowerCase();

    // bcrypt turns the password into a hash that cannot be reversed.
    user.password_hash = await bcrypt.hash(user.password_hash, 10);
});

export default User;
