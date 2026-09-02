import { randomUUID } from "crypto";
import type { QueryInterface } from "sequelize";

/**
 * Loads three test clinics with their people in charge.
 *
 * Each tax id is different, because the table does not allow repeats.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    const now = new Date();

    await context.bulkInsert("clinics", [
        {
            id: randomUUID(),
            name: "Clínica Las Américas",
            tax_id: "890900123-1",
            address: "Diagonal 75B No 2A-80, Medellín",
            phone: "6043421010",
            email: "contacto@lasamericas.com",
            manager_name: "Ana Gómez Ruiz",
            manager_email: "ana.gomez@lasamericas.com",
            manager_phone: "3001112233",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: randomUUID(),
            name: "Hospital San Vicente",
            tax_id: "890905166-2",
            address: "Calle 64 No 51D-154, Medellín",
            phone: "6044441234",
            email: "contacto@sanvicente.com",
            manager_name: "Carlos Mejía Ospina",
            manager_email: "carlos.mejia@sanvicente.com",
            manager_phone: "3014445566",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: randomUUID(),
            name: "Centro Médico El Poblado",
            tax_id: "901234567-3",
            address: "Carrera 43A No 5-15, Medellín",
            phone: "6045556677",
            email: "contacto@cmpoblado.com",
            manager_name: "Diana Torres Vélez",
            manager_email: "diana.torres@cmpoblado.com",
            manager_phone: "3027778899",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
    ]);
}

/**
 * Undoes the seeder by deleting every clinic.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.bulkDelete("clinics", {});
}
