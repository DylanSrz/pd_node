import { randomUUID } from "crypto";
import type { QueryInterface } from "sequelize";

/**
 * Loads the test catalog of medications.
 *
 * No quantity is stored here: the stock goes into
 * the inventory table, because it depends on each warehouse.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    const now = new Date();

    await context.bulkInsert("medications", [
        {
            id: randomUUID(),
            name: "Acetaminofén 500mg",
            description: "Analgésico y antipirético de uso general.",
            presentation: "Caja x 30 tabletas",
            laboratory: "Genfar",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: randomUUID(),
            name: "Ibuprofeno 400mg",
            description: "Antiinflamatorio no esteroideo.",
            presentation: "Caja x 20 tabletas",
            laboratory: "MK",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: randomUUID(),
            name: "Amoxicilina 500mg",
            description: "Antibiótico de amplio espectro.",
            presentation: "Caja x 15 cápsulas",
            laboratory: "La Santé",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: randomUUID(),
            name: "Solución salina 0.9%",
            description: "Solución para hidratación y limpieza de heridas.",
            presentation: "Bolsa 500 ml",
            laboratory: "Baxter",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: randomUUID(),
            name: "Jeringa desechable 5ml",
            description: "Insumo médico estéril de un solo uso.",
            presentation: "Paquete x 100 unidades",
            laboratory: "BD",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: randomUUID(),
            name: "Losartán 50mg",
            description: "Antihipertensivo para el control de la presión arterial.",
            presentation: "Caja x 30 tabletas",
            laboratory: "Tecnoquímicas",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
    ]);
}

/**
 * Undoes the seeder by deleting the whole catalog.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.bulkDelete("medications", {});
}
