import express from "express";
import swaggerUi from "swagger-ui-express";
import "dotenv/config";

import db from "./config/db.js";
import { swaggerSpecification } from "./config/swagger.js";

// Importing this file leaves every association between the models
// registered before the API starts serving requests.
import "./models/index.js";

import { errorHandler } from "./middlewares/error-handler.js";
import routerAuth from "./routes/auth.routes.js";
import routerClinics from "./routes/clinic.routes.js";
import routerWarehouses from "./routes/warehouse.routes.js";
import routerMedications from "./routes/medication.routes.js";
import routerInventory from "./routes/inventory.routes.js";
import routerRequests from "./routes/request.routes.js";

const { PORT } = process.env;

const app = express();

// Allows Express to read the body of the requests in JSON format.
app.use(express.json());

// Test route to check that the API is alive.
app.get("/", (_req, res) => {
    res.status(200).json({
        message: "RiwiMediCare Plus API up and running.",
        documentation: "/api-docs",
    });
});

// DOCUMENTATION
// Swagger UI is available at http://localhost:PORT/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

// API ENDPOINTS
app.use("/api/auth", routerAuth);
app.use("/api/clinics", routerClinics);
app.use("/api/warehouses", routerWarehouses);
app.use("/api/medications", routerMedications);
app.use("/api/inventory", routerInventory);
app.use("/api/requests", routerRequests);

// If no route matched, a clear 404 is returned.
app.use((_req, res) => {
    res.status(404).json({ message: "The requested route does not exist." });
});

// The error handler goes last, after the routes,
// because it catches what they pass to it with next(error).
app.use(errorHandler);

/**
 * Connects to the database and starts the server.
 * If the connection fails, it prints the error and does not start.
 */
async function start(): Promise<void> {
    try {
        // Checks that the credentials from the .env work
        // to connect to PostgreSQL.
        await db.authenticate();
        console.log("Database connection established.");

        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
            console.log(`Documentation available at: http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error("Error starting the application:", error);
    }
}

start();
