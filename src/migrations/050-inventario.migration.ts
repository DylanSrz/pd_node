import { DataTypes, type QueryInterface } from "sequelize";

/**
 * Crea la tabla "inventario", que dice cuántas unidades
 * de cada medicamento hay en cada almacén.
 *
 * Es una tabla intermedia entre almacenes y medicamentos:
 * un mismo medicamento puede estar en varios almacenes
 * con cantidades diferentes.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    await context.createTable("inventario", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        almacen_id: {
            type: DataTypes.UUID,
            allowNull: false,

            // Llave foránea: inventario.almacen_id -> almacenes.id
            references: {
                model: "almacenes",
                key: "id",
            },
        },
        medicamento_id: {
            type: DataTypes.UUID,
            allowNull: false,

            // Llave foránea: inventario.medicamento_id -> medicamentos.id
            references: {
                model: "medicamentos",
                key: "id",
            },
        },
        cantidad: {
            // Unidades disponibles de ese medicamento en ese almacén.
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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

    // Evita que se registre dos veces el mismo medicamento
    // en el mismo almacén.
    await context.addConstraint("inventario", {
        fields: ["almacen_id", "medicamento_id"],
        type: "unique",
        name: "inventario_almacen_medicamento_unico",
    });

    // Regla en la propia base de datos para que la cantidad
    // nunca pueda quedar en negativo.
    await context.sequelize.query(`
        ALTER TABLE inventario
        ADD CONSTRAINT inventario_cantidad_no_negativa
        CHECK (cantidad >= 0);
    `);
}

/**
 * Deshace la migración borrando la tabla "inventario".
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.dropTable("inventario");
}
