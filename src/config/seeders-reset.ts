import { seeder } from "./seeders.js";

// The "to: 0" tells Umzug to revert every seeder, not only the
// last one, and to clean up its control table.
//
// It is needed after a migrate:reset: that command drops the domain
// tables, but the seeder log survives, and without cleaning it
// "npm run seed" believes every seeder already ran and does not
// load the data again.
try {
    await seeder.down({ to: 0 });

    console.log("All seeders were reverted successfully.");
} catch (error) {
    console.error("Error reverting the seeders:", error);

    process.exit(1);
}
