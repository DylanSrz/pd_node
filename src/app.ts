import express from "express";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";

import db from "./config/db.js";
import { especificacionSwagger } from "./config/swagger.js";

// Importar este archivo deja registradas todas las asociaciones
// entre los modelos antes de que la API empiece a atender peticiones.
import "./models/index.js";

import { errorHandler } from "./middlewares/error-handler.js";
import routerAuth from "./routes/auth.routes.js";
import routerClinicas from "./routes/clinica.routes.js";
import routerAlmacenes from "./routes/almacen.routes.js";
import routerMedicamentos from "./routes/medicamento.routes.js";
import routerInventario from "./routes/inventario.routes.js";
import routerSolicitudes from "./routes/solicitud.routes.js";

const { PORT } = process.env;

const app = express();

// Permite que Express lea el body de las peticiones en formato JSON.
app.use(express.json());

// Ruta de prueba para comprobar que la API está viva.
app.get("/", (_req, res) => {
    res.status(200).json({
        message: "API RiwiMediCare Plus funcionando.",
        documentacion: "/api-docs",
    });
});

// DOCUMENTACIÓN
// Swagger UI queda disponible en http://localhost:PORT/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(especificacionSwagger));

// ENDPOINTS DE LA API
app.use("/api/auth", routerAuth);
app.use("/api/clinicas", routerClinicas);
app.use("/api/almacenes", routerAlmacenes);
app.use("/api/medicamentos", routerMedicamentos);
app.use("/api/inventario", routerInventario);
app.use("/api/solicitudes", routerSolicitudes);

// Si ninguna ruta coincidió, se responde un 404 claro.
app.use((_req, res) => {
    res.status(404).json({ message: "La ruta solicitada no existe." });
});

// El manejador de errores va de último, después de las rutas,
// porque atrapa lo que ellas le pasen con next(error).
app.use(errorHandler);

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
            console.log(`Documentación disponible en: http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error("Error al iniciar la aplicación:", error);
    }
}

start();
