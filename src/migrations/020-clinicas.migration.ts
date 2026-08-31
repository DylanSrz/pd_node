import { DataTypes, type QueryInterface } from "sequelize";

/**
 * Crea la tabla "clinicas", con los datos de cada clínica
 * y los de la persona responsable a la que hay que contactar.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    await context.createTable("clinicas", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        nit: {
            type: DataTypes.STRING(20),
            allowNull: false,

            // El NIT identifica a la clínica, no se puede repetir.
            unique: true,
        },
        direccion: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        // Datos del responsable de la clínica.
        responsable_nombre: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        responsable_email: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        responsable_telefono: {
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
 * Deshace la migración borrando la tabla "clinicas".
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.dropTable("clinicas");
}
