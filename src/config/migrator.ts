import { SequelizeStorage, Umzug } from "umzug";
import db from "./db.js";

// In development this file runs as .ts through tsx;
// once compiled, as .js inside dist.
//
// The glob has to point to the matching format in each case.
const isCompiled = import.meta.url.endsWith('.js')

export const migrator = new Umzug({
    migrations: {
        glob: isCompiled ? 'dist/migrations/*.js' : 'src/migrations/*.ts'
    },
    context: db.getQueryInterface(),
    storage: new SequelizeStorage({
        sequelize: db,
        tableName: 'migrations',
        timestamps: true
    }),
    logger: console
})
