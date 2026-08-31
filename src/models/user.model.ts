import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";

import db from "../config/db.js";
import { ROLES_USUARIO, type RolUsuario } from "../types/enums.js";

/**
 * Usuario que puede autenticarse en la API.
 * Puede ser administrador o gestor de solicitudes.
 */
class User extends Model {
    // Identificador único del usuario.
    declare id: string;

    // Nombre del usuario.
    declare first_name: string;

    // Apellido del usuario.
    declare last_name: string;

    // Correo con el que inicia sesión. No se repite.
    declare email: string;

    // Contraseña guardada cifrada con bcrypt, nunca en texto plano.
    declare password_hash: string;

    // Rol que define qué puede hacer dentro del sistema.
    declare role: RolUsuario;

    // Se pone en false cuando el usuario se elimina lógicamente.
    declare is_active: boolean;

    // Fechas que Sequelize administra solo.
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

            // Revisa que el texto tenga forma de correo electrónico.
            validate: {
                isEmail: true,
            },
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(...ROLES_USUARIO),
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

// Antes de guardar un usuario nuevo:
// se pasan los textos a minúsculas y se cifra la contraseña.
User.beforeCreate(async (user: User) => {
    user.first_name = user.first_name.toLowerCase();
    user.last_name = user.last_name.toLowerCase();
    user.email = user.email.toLowerCase();

    // bcrypt convierte la contraseña en un hash que no se puede revertir.
    user.password_hash = await bcrypt.hash(user.password_hash, 10);
});

export default User;
