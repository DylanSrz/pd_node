import { randomUUID } from "crypto";
import type { QueryInterface } from "sequelize";
import bcrypt from "bcrypt";

/**
 * Carga los usuarios de prueba: dos administradores y dos gestores.
 *
 * Las contraseñas se guardan cifradas con bcrypt, igual que cuando
 * un usuario se registra por el endpoint. El hook del modelo no se
 * ejecuta aquí porque bulkInsert escribe directo en la tabla, así
 * que hay que cifrarlas a mano.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    // El 10 es el "costo": cuántas vueltas da bcrypt al cifrar.
    // A mayor número, más seguro pero más lento.
    const claveAdmin = await bcrypt.hash("admin1234", 10);
    const claveGestor = await bcrypt.hash("gestor1234", 10);

    const ahora = new Date();

    await context.bulkInsert("users", [
        {
            id: randomUUID(),
            first_name: "dylan alberto",
            last_name: "suárez laverde",
            email: "dylan.suarez@riwimedicare.com",
            password_hash: claveAdmin,
            role: "administrador",
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        },
        {
            id: randomUUID(),
            first_name: "camilo",
            last_name: "del valle",
            email: "camilo.delvalle@riwimedicare.com",
            password_hash: claveAdmin,
            role: "administrador",
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        },
        {
            id: randomUUID(),
            first_name: "abrahan",
            last_name: "villa",
            email: "abrahan.villa@riwimedicare.com",
            password_hash: claveGestor,
            role: "gestor",
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        },
        {
            id: randomUUID(),
            first_name: "laura",
            last_name: "restrepo",
            email: "laura.restrepo@riwimedicare.com",
            password_hash: claveGestor,
            role: "gestor",
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        },
    ]);
}

/**
 * Deshace el seeder borrando todos los usuarios.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.bulkDelete("users", {});
}
