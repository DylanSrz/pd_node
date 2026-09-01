import { randomUUID } from "crypto";
import type { QueryInterface } from "sequelize";

/**
 * Carga tres clínicas de prueba con sus responsables.
 *
 * Cada NIT es distinto, porque la tabla no permite repetirlos.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    const ahora = new Date();

    await context.bulkInsert("clinicas", [
        {
            id: randomUUID(),
            nombre: "Clínica Las Américas",
            nit: "890900123-1",
            direccion: "Diagonal 75B No 2A-80, Medellín",
            telefono: "6043421010",
            email: "contacto@lasamericas.com",
            responsable_nombre: "Ana Gómez Ruiz",
            responsable_email: "ana.gomez@lasamericas.com",
            responsable_telefono: "3001112233",
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        },
        {
            id: randomUUID(),
            nombre: "Hospital San Vicente",
            nit: "890905166-2",
            direccion: "Calle 64 No 51D-154, Medellín",
            telefono: "6044441234",
            email: "contacto@sanvicente.com",
            responsable_nombre: "Carlos Mejía Ospina",
            responsable_email: "carlos.mejia@sanvicente.com",
            responsable_telefono: "3014445566",
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        },
        {
            id: randomUUID(),
            nombre: "Centro Médico El Poblado",
            nit: "901234567-3",
            direccion: "Carrera 43A No 5-15, Medellín",
            telefono: "6045556677",
            email: "contacto@cmpoblado.com",
            responsable_nombre: "Diana Torres Vélez",
            responsable_email: "diana.torres@cmpoblado.com",
            responsable_telefono: "3027778899",
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        },
    ]);
}

/**
 * Deshace el seeder borrando todas las clínicas.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.bulkDelete("clinicas", {});
}
