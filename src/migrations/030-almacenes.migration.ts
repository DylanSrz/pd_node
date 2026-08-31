import { DataTypes, type QueryInterface } from "sequelize";

/**
 * Crea la tabla "almacenes", los depósitos desde donde
 * se despachan los medicamentos hacia las clínicas.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    await context.createTable("almacenes", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        direccion: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        telefono: {
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
 * Deshace la migración borrando la tabla "almacenes".
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.dropTable("almacenes");
}
