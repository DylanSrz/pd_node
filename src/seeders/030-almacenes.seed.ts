import { randomUUID } from "crypto";
import type { QueryInterface } from "sequelize";

/**
 * Carga dos almacenes de prueba.
 *
 * Tener dos permite demostrar que un mismo medicamento puede estar
 * en varios almacenes con cantidades diferentes.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    const ahora = new Date();

    await context.bulkInsert("almacenes", [
        {
            id: randomUUID(),
            nombre: "Almacén Central Medellín",
            direccion: "Carrera 50 No 20-30, Medellín",
            telefono: "6044441111",
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        },
        {
            id: randomUUID(),
            nombre: "Almacén Norte Bello",
            direccion: "Calle 45 No 38-245, Bello",
            telefono: "6044552222",
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        },
    ]);
}

/**
 * Deshace el seeder borrando todos los almacenes.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.bulkDelete("almacenes", {});
}
