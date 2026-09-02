import { randomUUID } from "crypto";
import type { QueryInterface } from "sequelize";

/**
 * Loads two test warehouses.
 *
 * Having two makes it possible to show that the same medication can be
 * stored in several warehouses with different quantities.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    const now = new Date();

    await context.bulkInsert("warehouses", [
        {
            id: randomUUID(),
            name: "Almacén Central Medellín",
            address: "Carrera 50 No 20-30, Medellín",
            phone: "6044441111",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: randomUUID(),
            name: "Almacén Norte Bello",
            address: "Calle 45 No 38-245, Bello",
            phone: "6044552222",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
    ]);
}

/**
 * Undoes the seeder by deleting every warehouse.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.bulkDelete("warehouses", {});
}
