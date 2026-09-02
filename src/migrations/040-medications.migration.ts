import { DataTypes, type QueryInterface } from "sequelize";

/**
 * Creates the "medications" table with the catalog of products
 * the company distributes.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    await context.createTable("medications", {
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
            // Examples: "Caja x 30 tabletas", "Frasco 120 ml".
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
 * Undoes the migration by dropping the "medications" table.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.dropTable("medications");
}
