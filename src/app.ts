import express from "express";
import "dotenv/config";

import db from "./config/db.js";

const { PORT } = process.env;

const app = express();

// Permite que Express lea el body de las peticiones en formato JSON.
app.use(express.json());

// Ruta de prueba para comprobar que la API está viva.
app.get("/", (_req, res) => {
    res.status(200).json({ message: "API RiwiMediCare Plus funcionando." });
});

/**
 * Conecta con la base de datos y levanta el servidor.
 * Si la conexión falla, muestra el error y no arranca.
 */
async function start(): Promise<void> {
    try {
        // Comprueba que las credenciales del .env sirven
        // para conectarse a PostgreSQL.
        await db.authenticate();
        console.log("Conexión con la base de datos establecida.");

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto: ${PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar la aplicación:", error);
    }
}

start();
