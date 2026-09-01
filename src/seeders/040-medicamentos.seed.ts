import { randomUUID } from "crypto";
import type { QueryInterface } from "sequelize";

/**
 * Carga el catálogo de medicamentos de prueba.
 *
 * Aquí no se guarda ninguna cantidad: las existencias van
 * en la tabla inventario, porque dependen de cada almacén.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    const ahora = new Date();

    await context.bulkInsert("medicamentos", [
        {
            id: randomUUID(),
            nombre: "Acetaminofén 500mg",
            descripcion: "Analgésico y antipirético de uso general.",
            presentacion: "Caja x 30 tabletas",
            laboratorio: "Genfar",
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        },
        {
            id: randomUUID(),
            nombre: "Ibuprofeno 400mg",
            descripcion: "Antiinflamatorio no esteroideo.",
            presentacion: "Caja x 20 tabletas",
            laboratorio: "MK",
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        },
        {
            id: randomUUID(),
            nombre: "Amoxicilina 500mg",
            descripcion: "Antibiótico de amplio espectro.",
            presentacion: "Caja x 15 cápsulas",
            laboratorio: "La Santé",
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        },
        {
            id: randomUUID(),
            nombre: "Solución salina 0.9%",
            descripcion: "Solución para hidratación y limpieza de heridas.",
            presentacion: "Bolsa 500 ml",
            laboratorio: "Baxter",
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        },
        {
            id: randomUUID(),
            nombre: "Jeringa desechable 5ml",
            descripcion: "Insumo médico estéril de un solo uso.",
            presentacion: "Paquete x 100 unidades",
            laboratorio: "BD",
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        },
        {
            id: randomUUID(),
            nombre: "Losartán 50mg",
            descripcion: "Antihipertensivo para el control de la presión arterial.",
            presentacion: "Caja x 30 tabletas",
            laboratorio: "Tecnoquímicas",
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        },
    ]);
}

/**
 * Deshace el seeder borrando todo el catálogo.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.bulkDelete("medicamentos", {});
}
