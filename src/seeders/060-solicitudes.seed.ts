import { randomUUID } from "crypto";
import { QueryTypes, type QueryInterface } from "sequelize";

import type { EstadoSolicitud } from "../types/enums.js";

/**
 * Fila con id y nombre, como vienen de clinicas, almacenes
 * y medicamentos.
 */
interface FilaConNombre {
    id: string;
    nombre: string;
}

/**
 * Fila de la tabla users. Se identifica por el correo,
 * que es el campo que no se repite.
 */
interface FilaUsuario {
    id: string;
    email: string;
}

/**
 * Solicitudes que se van a cargar, escritas con nombres en vez de ids.
 *
 * Se incluye al menos una de cada estado para poder probar tanto el
 * listado de solicitudes activas como el historial completo.
 */
const SOLICITUDES_A_CARGAR: Array<{
    clinica: string;
    medicamento: string;
    almacen: string;
    usuario: string;
    cantidad: number;
    estado: EstadoSolicitud;
    observaciones: string | null;
}> = [
    {
        clinica: "Clínica Las Américas",
        medicamento: "Acetaminofén 500mg",
        almacen: "Almacén Central Medellín",
        usuario: "abrahan.villa@riwimedicare.com",
        cantidad: 100,
        estado: "pendiente",
        observaciones: "Pedido mensual de analgésicos.",
    },
    {
        clinica: "Hospital San Vicente",
        medicamento: "Jeringa desechable 5ml",
        almacen: "Almacén Central Medellín",
        usuario: "laura.restrepo@riwimedicare.com",
        cantidad: 20,
        estado: "pendiente",
        observaciones: "Reposición de insumos de enfermería.",
    },
    {
        clinica: "Centro Médico El Poblado",
        medicamento: "Ibuprofeno 400mg",
        almacen: "Almacén Central Medellín",
        usuario: "abrahan.villa@riwimedicare.com",
        cantidad: 50,
        estado: "aprobada",
        observaciones: "Aprobada por el administrador.",
    },
    {
        clinica: "Clínica Las Américas",
        medicamento: "Amoxicilina 500mg",
        almacen: "Almacén Central Medellín",
        usuario: "laura.restrepo@riwimedicare.com",
        cantidad: 30,
        estado: "entregada",
        observaciones: "Entregada el mes pasado.",
    },
    {
        clinica: "Hospital San Vicente",
        medicamento: "Losartán 50mg",
        almacen: "Almacén Central Medellín",
        usuario: "abrahan.villa@riwimedicare.com",
        cantidad: 400,
        estado: "rechazada",
        observaciones: "Rechazada por exceder el consumo habitual.",
    },
    {
        clinica: "Centro Médico El Poblado",
        medicamento: "Solución salina 0.9%",
        almacen: "Almacén Norte Bello",
        usuario: "laura.restrepo@riwimedicare.com",
        cantidad: 25,
        estado: "cancelada",
        observaciones: "La clínica anuló el pedido.",
    },
];

/**
 * Carga las solicitudes de prueba y ajusta el inventario.
 *
 * Las solicitudes aprobadas y entregadas ya consumieron existencias,
 * así que al final se descuentan del inventario. De lo contrario los
 * datos de prueba quedarían contradiciendo la regla de negocio que
 * aplica la API cuando se aprueba una solicitud.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    // Se traen los ids de todas las tablas relacionadas.
    const clinicas = await context.sequelize.query<FilaConNombre>(
        "SELECT id, nombre FROM clinicas",
        { type: QueryTypes.SELECT }
    );

    const medicamentos = await context.sequelize.query<FilaConNombre>(
        "SELECT id, nombre FROM medicamentos",
        { type: QueryTypes.SELECT }
    );

    const almacenes = await context.sequelize.query<FilaConNombre>(
        "SELECT id, nombre FROM almacenes",
        { type: QueryTypes.SELECT }
    );

    const usuarios = await context.sequelize.query<FilaUsuario>(
        "SELECT id, email FROM users",
        { type: QueryTypes.SELECT }
    );

    const ahora = new Date();
    const registros = [];

    for (const solicitud of SOLICITUDES_A_CARGAR) {
        const clinica = clinicas.find((fila) => fila.nombre === solicitud.clinica);
        const medicamento = medicamentos.find(
            (fila) => fila.nombre === solicitud.medicamento
        );
        const almacen = almacenes.find((fila) => fila.nombre === solicitud.almacen);
        const usuario = usuarios.find((fila) => fila.email === solicitud.usuario);

        if (!clinica) {
            throw new Error(`No se encontró la clínica "${solicitud.clinica}".`);
        }

        if (!medicamento) {
            throw new Error(`No se encontró el medicamento "${solicitud.medicamento}".`);
        }

        if (!almacen) {
            throw new Error(`No se encontró el almacén "${solicitud.almacen}".`);
        }

        if (!usuario) {
            throw new Error(`No se encontró el usuario "${solicitud.usuario}".`);
        }

        registros.push({
            id: randomUUID(),
            clinica_id: clinica.id,
            medicamento_id: medicamento.id,
            almacen_id: almacen.id,
            usuario_id: usuario.id,
            cantidad_solicitada: solicitud.cantidad,
            estado: solicitud.estado,
            observaciones: solicitud.observaciones,
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        });

        // Las solicitudes aprobadas y entregadas ya sacaron unidades
        // del almacén, así que se descuentan del inventario para que
        // los datos queden coherentes.
        if (solicitud.estado === "aprobada" || solicitud.estado === "entregada") {
            await context.sequelize.query(
                `UPDATE inventario
                 SET cantidad = cantidad - :cantidad, "updatedAt" = NOW()
                 WHERE almacen_id = :almacenId AND medicamento_id = :medicamentoId`,
                {
                    replacements: {
                        cantidad: solicitud.cantidad,
                        almacenId: almacen.id,
                        medicamentoId: medicamento.id,
                    },
                    type: QueryTypes.UPDATE,
                }
            );
        }
    }

    await context.bulkInsert("solicitudes", registros);
}

/**
 * Deshace el seeder borrando todas las solicitudes.
 *
 * No se devuelven las unidades al inventario porque el seeder de
 * inventario también se revierte y vuelve a cargar sus cantidades
 * originales.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.bulkDelete("solicitudes", {});
}
