import { DataTypes, type QueryInterface } from "sequelize";

/**
 * Creates the "clinics" table, with the details of each clinic
 * and those of the person in charge who has to be contacted.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    await context.createTable("clinics", {
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

            // The tax id identifies the clinic, it cannot be repeated.
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
        },

        // Details of the person in charge of the clinic.
        manager_name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        manager_email: {
            type: DataTypes.STRING(150),
            allowNull: false,
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
 * Undoes the migration by dropping the "clinics" table.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.dropTable("clinics");
}
