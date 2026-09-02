import { SequelizeStorage, Umzug } from "umzug";
import db from "./db.js";

// In development this file runs as .ts through tsx;
// once compiled, as .js inside dist.
//
// The glob has to point to the matching format in each case.
const isCompiled = import.meta.url.endsWith(".js");

// Umzug takes care of running the seeders in order and of
// storing in the SequelizeData table which ones already ran.
export const seeder = new Umzug({
    migrations: {
        glob: isCompiled ? "dist/seeders/*.js" : "src/seeders/*.ts",
    },

    // The "context" is what the seeders receive in order to talk
    // to the database.
    context: db.getQueryInterface(),

    storage: new SequelizeStorage({
        sequelize: db,
        modelName: "SequelizeData",
        timestamps: true,
    }),

    logger: console,
});
