import { randomUUID } from "crypto";
import type { QueryInterface } from "sequelize";
import bcrypt from "bcrypt";

/**
 * Loads the test users: two admins and two managers.
 *
 * The passwords are stored hashed with bcrypt, just like when
 * a user signs up through the endpoint. The model hook does not
 * run here because bulkInsert writes straight into the table, so
 * they have to be hashed by hand.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    // The 10 is the "cost": how many rounds bcrypt takes when hashing.
    // The higher the number, the safer but the slower.
    const adminPassword = await bcrypt.hash("admin1234", 10);
    const managerPassword = await bcrypt.hash("gestor1234", 10);

    const now = new Date();

    await context.bulkInsert("users", [
        {
            id: randomUUID(),
            first_name: "dylan alberto",
            last_name: "suárez laverde",
            email: "dylan.suarez@riwimedicare.com",
            password_hash: adminPassword,
            role: "admin",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: randomUUID(),
            first_name: "camilo",
            last_name: "del valle",
            email: "camilo.delvalle@riwimedicare.com",
            password_hash: adminPassword,
            role: "admin",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: randomUUID(),
            first_name: "abrahan",
            last_name: "villa",
            email: "abrahan.villa@riwimedicare.com",
            password_hash: managerPassword,
            role: "manager",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: randomUUID(),
            first_name: "laura",
            last_name: "restrepo",
            email: "laura.restrepo@riwimedicare.com",
            password_hash: managerPassword,
            role: "manager",
            is_active: true,
            createdAt: now,
            updatedAt: now,
        },
    ]);
}

/**
 * Undoes the seeder by deleting every user.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.bulkDelete("users", {});
}
