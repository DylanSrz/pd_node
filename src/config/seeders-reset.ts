import { seeder } from "./seeders.js";

// El "to: 0" le indica a Umzug que revierta todos los seeders,
// no solo el último, y que limpie su tabla de control.
//
// Hace falta después de un migrate:reset: ese comando borra las
// tablas del dominio, pero el registro de los seeders sobrevive,
// y sin limpiarlo "npm run seed" cree que ya se ejecutaron todos
// y no vuelve a cargar los datos.
try {
    await seeder.down({ to: 0 });

    console.log("Todos los seeders fueron revertidos correctamente.");
} catch (error) {
    console.error("Error revirtiendo los seeders:", error);

    process.exit(1);
}
