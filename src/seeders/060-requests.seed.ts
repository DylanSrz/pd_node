import { randomUUID } from "crypto";
import { QueryTypes, type QueryInterface } from "sequelize";

import type { RequestStatus } from "../types/enums.js";

/**
 * Row with id and name, as they come from clinics, warehouses
 * and medications.
 */
interface RowWithName {
    id: string;
    name: string;
}

/**
 * Row of the users table. It is identified by the email,
 * which is the field that cannot be repeated.
 */
interface UserRow {
    id: string;
    email: string;
}

/**
 * Requests that are going to be loaded, written with names instead of ids.
 *
 * At least one of each status is included so that both the listing of
 * active requests and the full history can be tested.
 */
const REQUESTS_TO_LOAD: Array<{
    clinic: string;
    medication: string;
    warehouse: string;
    user: string;
    quantity: number;
    status: RequestStatus;
    notes: string | null;
}> = [
    {
        clinic: "Clínica Las Américas",
        medication: "Acetaminofén 500mg",
        warehouse: "Almacén Central Medellín",
        user: "abrahan.villa@riwimedicare.com",
        quantity: 100,
        status: "pending",
        notes: "Pedido mensual de analgésicos.",
    },
    {
        clinic: "Hospital San Vicente",
        medication: "Jeringa desechable 5ml",
        warehouse: "Almacén Central Medellín",
        user: "laura.restrepo@riwimedicare.com",
        quantity: 20,
        status: "pending",
        notes: "Reposición de insumos de enfermería.",
    },
    {
        clinic: "Centro Médico El Poblado",
        medication: "Ibuprofeno 400mg",
        warehouse: "Almacén Central Medellín",
        user: "abrahan.villa@riwimedicare.com",
        quantity: 50,
        status: "approved",
        notes: "Aprobada por el administrador.",
    },
    {
        clinic: "Clínica Las Américas",
        medication: "Amoxicilina 500mg",
        warehouse: "Almacén Central Medellín",
        user: "laura.restrepo@riwimedicare.com",
        quantity: 30,
        status: "delivered",
        notes: "Entregada el mes pasado.",
    },
    {
        clinic: "Hospital San Vicente",
        medication: "Losartán 50mg",
        warehouse: "Almacén Central Medellín",
        user: "abrahan.villa@riwimedicare.com",
        quantity: 400,
        status: "rejected",
        notes: "Rechazada por exceder el consumo habitual.",
    },
    {
        clinic: "Centro Médico El Poblado",
        medication: "Solución salina 0.9%",
        warehouse: "Almacén Norte Bello",
        user: "laura.restrepo@riwimedicare.com",
        quantity: 25,
        status: "cancelled",
        notes: "La clínica anuló el pedido.",
    },
];

/**
 * Loads the test requests and adjusts the inventory.
 *
 * The approved and delivered requests already consumed stock,
 * so at the end they are discounted from the inventory. Otherwise the
 * test data would contradict the business rule the API applies
 * when a request is approved.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    // The ids of every related table are fetched.
    const clinics = await context.sequelize.query<RowWithName>(
        "SELECT id, name FROM clinics",
        { type: QueryTypes.SELECT }
    );

    const medications = await context.sequelize.query<RowWithName>(
        "SELECT id, name FROM medications",
        { type: QueryTypes.SELECT }
    );

    const warehouses = await context.sequelize.query<RowWithName>(
        "SELECT id, name FROM warehouses",
        { type: QueryTypes.SELECT }
    );

    const users = await context.sequelize.query<UserRow>(
        "SELECT id, email FROM users",
        { type: QueryTypes.SELECT }
    );

    const now = new Date();
    const records = [];

    for (const request of REQUESTS_TO_LOAD) {
        const clinic = clinics.find((row) => row.name === request.clinic);
        const medication = medications.find((row) => row.name === request.medication);
        const warehouse = warehouses.find((row) => row.name === request.warehouse);
        const user = users.find((row) => row.email === request.user);

        if (!clinic) {
            throw new Error(`The clinic "${request.clinic}" was not found.`);
        }

        if (!medication) {
            throw new Error(`The medication "${request.medication}" was not found.`);
        }

        if (!warehouse) {
            throw new Error(`The warehouse "${request.warehouse}" was not found.`);
        }

        if (!user) {
            throw new Error(`The user "${request.user}" was not found.`);
        }

        records.push({
            id: randomUUID(),
            clinic_id: clinic.id,
            medication_id: medication.id,
            warehouse_id: warehouse.id,
            user_id: user.id,
            requested_quantity: request.quantity,
            status: request.status,
            notes: request.notes,
            is_active: true,
            createdAt: now,
            updatedAt: now,
        });

        // The approved and delivered requests already took units
        // out of the warehouse, so they are discounted from the
        // inventory to keep the data consistent.
        if (request.status === "approved" || request.status === "delivered") {
            await context.sequelize.query(
                `UPDATE inventory
                 SET quantity = quantity - :quantity, "updatedAt" = NOW()
                 WHERE warehouse_id = :warehouseId AND medication_id = :medicationId`,
                {
                    replacements: {
                        quantity: request.quantity,
                        warehouseId: warehouse.id,
                        medicationId: medication.id,
                    },
                    type: QueryTypes.UPDATE,
                }
            );
        }
    }

    await context.bulkInsert("requests", records);
}

/**
 * Undoes the seeder by deleting every request.
 *
 * The units are not returned to the inventory because the inventory
 * seeder is reverted too and loads its original quantities again.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.bulkDelete("requests", {});
}
