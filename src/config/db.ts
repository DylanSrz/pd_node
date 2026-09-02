import { Sequelize } from "sequelize";
import "dotenv/config";

const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME
} = process.env;

const db = new Sequelize(
    DATABASE_NAME || "",
    DATABASE_USER || "",
    DATABASE_PASSWORD || "",
    {
        // Host where PostgreSQL lives.
        host: DATABASE_HOST || "localhost",

        // PostgreSQL port.
        //
        // Inside the API container, docker-compose
        // pins DATABASE_PORT to 5432.
        //
        // Outside Docker the value from the .env is used, with 5432
        // as the last resort.
        port: Number(DATABASE_PORT) || 5432,

        // Database engine.
        dialect: "postgres",

        // Show the SQL queries built by Sequelize.
        logging: console.log,
    }
);


export default db;
