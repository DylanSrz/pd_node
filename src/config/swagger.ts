import swaggerJsdoc from "swagger-jsdoc";

// In development the routes are read from the .ts files;
// once compiled, from the .js files inside the dist folder.
//
// swagger-jsdoc reads the @swagger comments of those files,
// and TypeScript keeps the comments when compiling.
const isCompiled = import.meta.url.endsWith(".js");

const filesToDocument = isCompiled ? ["dist/routes/*.js"] : ["src/routes/*.ts"];

/**
 * Configuration of the API documentation.
 *
 * The "definition" part describes the API in general: title, version,
 * server and how it is authenticated. The "apis" part tells swagger-jsdoc
 * in which files to look for the comments of each endpoint.
 */
const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "RiwiMediCare Plus API",
            version: "1.0.0",
            description:
                "REST API to manage the life cycle of the medication supply requests of the company RiwiMediCare Plus. It allows managing clinics, warehouses, medications, inventory and requests, with JSON Web Token authentication and two roles: admin and request manager.",
        },

        servers: [
            {
                url: `http://localhost:${process.env.PORT ?? 3000}`,
                description: "Local development server",
            },
        ],

        // Groups the endpoints by module in the Swagger interface.
        tags: [
            { name: "Authentication", description: "Sign up and sign in" },
            { name: "Clinics", description: "Clinics and care centers" },
            { name: "Warehouses", description: "Distribution warehouses" },
            { name: "Medications", description: "Catalog of medications and supplies" },
            { name: "Inventory", description: "Stock per warehouse and medication" },
            { name: "Requests", description: "Supply requests" },
        ],

        components: {
            // Defines the Swagger padlock: the token is sent in the
            // Authorization header with the "Bearer <token>" format.
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description:
                        "Paste here the token returned by POST /api/auth/login. There is no need to type the word Bearer.",
                },
            },

            // Data models the routes reference with $ref,
            // so the same structure is not repeated in every endpoint.
            schemas: {
                Error: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "The clinic does not exist or was deleted.",
                        },
                    },
                },

                ValidationError: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Invalid or incomplete data.",
                        },
                        errors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    field: { type: "string", example: "tax_id" },
                                    detail: {
                                        type: "string",
                                        example: "The tax id must have at least 5 characters.",
                                    },
                                },
                            },
                        },
                    },
                },

                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        first_name: { type: "string", example: "dylan alberto" },
                        last_name: { type: "string", example: "suárez laverde" },
                        email: {
                            type: "string",
                            example: "dylan.suarez@riwimedicare.com",
                        },
                        role: {
                            type: "string",
                            enum: ["admin", "manager"],
                            example: "admin",
                        },
                        is_active: { type: "boolean", example: true },
                    },
                },

                Clinic: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Clínica Las Américas" },
                        tax_id: { type: "string", example: "890900123-1" },
                        address: {
                            type: "string",
                            example: "Diagonal 75B No 2A-80, Medellín",
                        },
                        phone: { type: "string", example: "6043421010" },
                        email: { type: "string", example: "contacto@lasamericas.com" },
                        manager_name: { type: "string", example: "Ana Gómez Ruiz" },
                        manager_email: {
                            type: "string",
                            example: "ana.gomez@lasamericas.com",
                        },
                        manager_phone: { type: "string", example: "3001112233" },
                        is_active: { type: "boolean", example: true },
                    },
                },

                Warehouse: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Almacén Central Medellín" },
                        address: {
                            type: "string",
                            example: "Carrera 50 No 20-30, Medellín",
                        },
                        phone: { type: "string", example: "6044441111" },
                        is_active: { type: "boolean", example: true },
                    },
                },

                Medication: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string", example: "Acetaminofén 500mg" },
                        description: {
                            type: "string",
                            example: "Analgésico y antipirético de uso general.",
                        },
                        presentation: { type: "string", example: "Caja x 30 tabletas" },
                        laboratory: { type: "string", example: "Genfar" },
                        is_active: { type: "boolean", example: true },
                    },
                },

                Inventory: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        warehouse_id: { type: "string", format: "uuid" },
                        medication_id: { type: "string", format: "uuid" },
                        quantity: { type: "integer", example: 500 },
                        is_active: { type: "boolean", example: true },
                        warehouse: { $ref: "#/components/schemas/Warehouse" },
                        medication: { $ref: "#/components/schemas/Medication" },
                    },
                },

                Request: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        clinic_id: { type: "string", format: "uuid" },
                        medication_id: { type: "string", format: "uuid" },
                        warehouse_id: { type: "string", format: "uuid" },
                        user_id: { type: "string", format: "uuid" },
                        requested_quantity: { type: "integer", example: 100 },
                        status: {
                            type: "string",
                            enum: [
                                "pending",
                                "approved",
                                "rejected",
                                "delivered",
                                "cancelled",
                            ],
                            example: "pending",
                        },
                        notes: {
                            type: "string",
                            nullable: true,
                            example: "Pedido mensual de analgésicos.",
                        },
                        is_active: { type: "boolean", example: true },
                        clinic: { $ref: "#/components/schemas/Clinic" },
                        medication: { $ref: "#/components/schemas/Medication" },
                        warehouse: { $ref: "#/components/schemas/Warehouse" },
                        user: { $ref: "#/components/schemas/User" },
                    },
                },
            },
        },

        // By default every endpoint asks for a token. The two
        // authentication ones disable it with "security: []" in their own
        // comment, because they are public.
        security: [{ bearerAuth: [] }],
    },

    apis: filesToDocument,
};

/**
 * OpenAPI document already built, ready to hand over to Swagger UI.
 */
export const swaggerSpecification = swaggerJsdoc(swaggerOptions);
