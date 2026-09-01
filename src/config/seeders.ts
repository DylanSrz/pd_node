import { SequelizeStorage, Umzug } from "umzug";
import db from "./db.js";

// En desarrollo este archivo se ejecuta como .ts con tsx;
// compilado, como .js dentro de dist.
//
// El glob tiene que apuntar al mismo formato en cada caso.
const isCompiled = import.meta.url.endsWith(".js");

// Umzug se encarga de ejecutar los seeders en orden y de
// guardar en la tabla SequelizeData cuáles ya se ejecutaron.
export const seeder = new Umzug({
    migrations: {
        glob: isCompiled ? "dist/seeders/*.js" : "src/seeders/*.ts",
    },

    // El "context" es lo que reciben los seeders para hablar
    // con la base de datos.
    context: db.getQueryInterface(),

    storage: new SequelizeStorage({
        sequelize: db,
        modelName: "SequelizeData",
        timestamps: true,
    }),

    logger: console,
});
