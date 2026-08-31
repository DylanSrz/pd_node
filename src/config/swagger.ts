import swaggerJsdoc from "swagger-jsdoc";

// En desarrollo las rutas se leen desde los archivos .ts;
// compilado, desde los .js de la carpeta dist.
//
// swagger-jsdoc lee los comentarios @swagger de esos archivos,
// y TypeScript conserva los comentarios al compilar.
const isCompiled = import.meta.url.endsWith(".js");

const rutasADocumentar = isCompiled ? ["dist/routes/*.js"] : ["src/routes/*.ts"];

/**
 * Configuración de la documentación de la API.
 *
 * La parte "definition" describe la API en general: título, versión,
 * servidor y cómo se autentica. La parte "apis" le dice a swagger-jsdoc
 * en qué archivos buscar los comentarios de cada endpoint.
 */
const opcionesSwagger: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "API RiwiMediCare Plus",
            version: "1.0.0",
            description:
                "API REST para gestionar el ciclo de vida de las solicitudes de abastecimiento de medicamentos de la empresa RiwiMediCare Plus. Permite administrar clínicas, almacenes, medicamentos, inventario y solicitudes, con autenticación por JSON Web Token y dos roles: administrador y gestor de solicitudes.",
        },

        servers: [
            {
                url: `http://localhost:${process.env.PORT ?? 3000}`,
                description: "Servidor local de desarrollo",
            },
        ],

        // Agrupa los endpoints por módulo en la interfaz de Swagger.
        tags: [
            { name: "Autenticación", description: "Registro e inicio de sesión" },
            { name: "Clínicas", description: "Clínicas y centros de atención" },
            { name: "Almacenes", description: "Almacenes de distribución" },
            { name: "Medicamentos", description: "Catálogo de medicamentos e insumos" },
            { name: "Inventario", description: "Existencias por almacén y medicamento" },
            { name: "Solicitudes", description: "Solicitudes de abastecimiento" },
        ],

        components: {
            // Define el candado de Swagger: se envía el token en la
            // cabecera Authorization con el formato "Bearer <token>".
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description:
                        "Pegue aquí el token que devuelve POST /api/auth/login. No hace falta escribir la palabra Bearer.",
                },
            },

            // Modelos de datos que las rutas referencian con $ref,
            // para no repetir la misma estructura en cada endpoint.
            schemas: {
                Error: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "La clínica no existe o fue eliminada.",
                        },
                    },
                },

                ErrorValidacion: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Datos inválidos o incompletos.",
                        },
                        errors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    campo: { type: "string", example: "nit" },
                                    detalle: {
                                        type: "string",
                                        example: "El NIT debe tener al menos 5 caracteres.",
                                    },
                                },
                            },
                        },
                    },
                },

                Usuario: {
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
                            enum: ["administrador", "gestor"],
                            example: "administrador",
                        },
                        is_active: { type: "boolean", example: true },
                    },
                },

                Clinica: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        nombre: { type: "string", example: "Clínica Las Américas" },
                        nit: { type: "string", example: "890900123-1" },
                        direccion: {
                            type: "string",
                            example: "Diagonal 75B No 2A-80, Medellín",
                        },
                        telefono: { type: "string", example: "6043421010" },
                        email: { type: "string", example: "contacto@lasamericas.com" },
                        responsable_nombre: { type: "string", example: "Ana Gómez Ruiz" },
                        responsable_email: {
                            type: "string",
                            example: "ana.gomez@lasamericas.com",
                        },
                        responsable_telefono: { type: "string", example: "3001112233" },
                        is_active: { type: "boolean", example: true },
                    },
                },

                Almacen: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        nombre: { type: "string", example: "Almacén Central Medellín" },
                        direccion: {
                            type: "string",
                            example: "Carrera 50 No 20-30, Medellín",
                        },
                        telefono: { type: "string", example: "6044441111" },
                        is_active: { type: "boolean", example: true },
                    },
                },

                Medicamento: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        nombre: { type: "string", example: "Acetaminofén 500mg" },
                        descripcion: {
                            type: "string",
                            example: "Analgésico y antipirético de uso general.",
                        },
                        presentacion: { type: "string", example: "Caja x 30 tabletas" },
                        laboratorio: { type: "string", example: "Genfar" },
                        is_active: { type: "boolean", example: true },
                    },
                },

                Inventario: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        almacen_id: { type: "string", format: "uuid" },
                        medicamento_id: { type: "string", format: "uuid" },
                        cantidad: { type: "integer", example: 500 },
                        is_active: { type: "boolean", example: true },
                        almacen: { $ref: "#/components/schemas/Almacen" },
                        medicamento: { $ref: "#/components/schemas/Medicamento" },
                    },
                },

                Solicitud: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        clinica_id: { type: "string", format: "uuid" },
                        medicamento_id: { type: "string", format: "uuid" },
                        almacen_id: { type: "string", format: "uuid" },
                        usuario_id: { type: "string", format: "uuid" },
                        cantidad_solicitada: { type: "integer", example: 100 },
                        estado: {
                            type: "string",
                            enum: [
                                "pendiente",
                                "aprobada",
                                "rechazada",
                                "entregada",
                                "cancelada",
                            ],
                            example: "pendiente",
                        },
                        observaciones: {
                            type: "string",
                            nullable: true,
                            example: "Pedido mensual de analgésicos.",
                        },
                        is_active: { type: "boolean", example: true },
                        clinica: { $ref: "#/components/schemas/Clinica" },
                        medicamento: { $ref: "#/components/schemas/Medicamento" },
                        almacen: { $ref: "#/components/schemas/Almacen" },
                        usuario: { $ref: "#/components/schemas/Usuario" },
                    },
                },
            },
        },

        // Por defecto todos los endpoints piden token. Los dos de
        // autenticación lo desactivan con "security: []" en su propio
        // comentario, porque son públicos.
        security: [{ bearerAuth: [] }],
    },

    apis: rutasADocumentar,
};

/**
 * Documento OpenAPI ya armado, listo para entregárselo a Swagger UI.
 */
export const especificacionSwagger = swaggerJsdoc(opcionesSwagger);
