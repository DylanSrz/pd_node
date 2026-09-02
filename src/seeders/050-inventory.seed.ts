import { randomUUID } from "crypto";
import { QueryTypes, type QueryInterface } from "sequelize";

/**
 * Row as it comes from a query against warehouses or medications.
 * Only the id and the name are needed in order to relate them.
 */
interface RowWithName {
    id: string;
    name: string;
}

/**
 * Stock that is going to be loaded, written with names instead of ids.
 *
 * The ids are generated at random every time the seeders run,
 * so they cannot be written by hand: they have to be looked up by name.
 */
const STOCK_TO_LOAD = [
    // The Central warehouse handles the six medications of the catalog.
    { warehouse: "Almacén Central Medellín", medication: "Acetaminofén 500mg", quantity: 500 },
    { warehouse: "Almacén Central Medellín", medication: "Ibuprofeno 400mg", quantity: 300 },
    { warehouse: "Almacén Central Medellín", medication: "Amoxicilina 500mg", quantity: 200 },
    { warehouse: "Almacén Central Medellín", medication: "Solución salina 0.9%", quantity: 150 },
    { warehouse: "Almacén Central Medellín", medication: "Jeringa desechable 5ml", quantity: 80 },
    { warehouse: "Almacén Central Medellín", medication: "Losartán 50mg", quantity: 120 },

    // The North warehouse only handles three. That way the error
    // "The selected warehouse does not handle that medication" can be checked.
    { warehouse: "Almacén Norte Bello", medication: "Acetaminofén 500mg", quantity: 250 },
    { warehouse: "Almacén Norte Bello", medication: "Ibuprofeno 400mg", quantity: 40 },
    { warehouse: "Almacén Norte Bello", medication: "Solución salina 0.9%", quantity: 60 },
];

/**
 * Loads the stock of each medication in each warehouse.
 *
 * Before inserting, the ids of the warehouses and of the medications
 * created by the previous seeders have to be looked up.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    // Every warehouse is fetched with its id and its name.
    const warehouses = await context.sequelize.query<RowWithName>(
        "SELECT id, name FROM warehouses",
        { type: QueryTypes.SELECT }
    );

    // Every medication is fetched with its id and its name.
    const medications = await context.sequelize.query<RowWithName>(
        "SELECT id, name FROM medications",
        { type: QueryTypes.SELECT }
    );

    const now = new Date();
    const records = [];

    // For each stock entry of the list its matching ids are looked up.
    for (const stock of STOCK_TO_LOAD) {
        const warehouse = warehouses.find((row) => row.name === stock.warehouse);
        const medication = medications.find((row) => row.name === stock.medication);

        // If any is missing it is because the previous seeders did not run.
        if (!warehouse) {
            throw new Error(`The warehouse "${stock.warehouse}" was not found.`);
        }

        if (!medication) {
            throw new Error(`The medication "${stock.medication}" was not found.`);
        }

        records.push({
            id: randomUUID(),
            warehouse_id: warehouse.id,
            medication_id: medication.id,
            quantity: stock.quantity,
            is_active: true,
            createdAt: now,
            updatedAt: now,
        });
    }

    await context.bulkInsert("inventory", records);
}

/**
 * Undoes the seeder by deleting the whole inventory.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.bulkDelete("inventory", {});
}
