import { DataTypes, type QueryInterface } from "sequelize";

/**
 * Crea la tabla "medicamentos" con el catálogo de productos
 * que la empresa distribuye.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    await context.createTable("medicamentos", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        presentacion: {
            // Ejemplos: "Caja x 30 tabletas", "Frasco 120 ml".
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        laboratorio: {
            type: DataTypes.STRING(150),
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
 * Deshace la migración borrando la tabla "medicamentos".
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.dropTable("medicamentos");
}
