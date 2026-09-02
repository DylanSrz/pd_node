import { migrator } from "./migrator.js";

try {
    await migrator.down({ to: 0 });

    console.log("All migrations were reverted successfully.");
} catch (error) {
    console.error("Error reverting the migrations:", error);
    process.exit(1);
}
