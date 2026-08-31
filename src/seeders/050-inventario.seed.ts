import { randomUUID } from "crypto";
import { QueryTypes, type QueryInterface } from "sequelize";

/**
 * Fila tal como viene de una consulta a almacenes o medicamentos.
 * Solo se necesitan el id y el nombre para poder relacionarlos.
 */
interface FilaConNombre {
    id: string;
    nombre: string;
}

/**
 * Existencias que se van a cargar, escritas con nombres en vez de ids.
 *
 * Los ids se generan al azar cada vez que se ejecutan los seeders,
 * así que no se pueden escribir a mano: hay que buscarlos por nombre.
 */
const EXISTENCIAS_A_CARGAR = [
    // El Almacén Central maneja los seis medicamentos del catálogo.
    { almacen: "Almacén Central Medellín", medicamento: "Acetaminofén 500mg", cantidad: 500 },
    { almacen: "Almacén Central Medellín", medicamento: "Ibuprofeno 400mg", cantidad: 300 },
    { almacen: "Almacén Central Medellín", medicamento: "Amoxicilina 500mg", cantidad: 200 },
    { almacen: "Almacén Central Medellín", medicamento: "Solución salina 0.9%", cantidad: 150 },
    { almacen: "Almacén Central Medellín", medicamento: "Jeringa desechable 5ml", cantidad: 80 },
    { almacen: "Almacén Central Medellín", medicamento: "Losartán 50mg", cantidad: 120 },

    // El Almacén Norte solo maneja tres. Así se puede comprobar el error
    // "El almacén seleccionado no maneja ese medicamento".
    { almacen: "Almacén Norte Bello", medicamento: "Acetaminofén 500mg", cantidad: 250 },
    { almacen: "Almacén Norte Bello", medicamento: "Ibuprofeno 400mg", cantidad: 40 },
    { almacen: "Almacén Norte Bello", medicamento: "Solución salina 0.9%", cantidad: 60 },
];

/**
 * Carga las existencias de cada medicamento en cada almacén.
 *
 * Antes de insertar hay que buscar los ids de los almacenes y de los
 * medicamentos que se crearon en los seeders anteriores.
 */
export async function up({ context }: { context: QueryInterface }): Promise<void> {
    // Se traen todos los almacenes con su id y su nombre.
    const almacenes = await context.sequelize.query<FilaConNombre>(
        "SELECT id, nombre FROM almacenes",
        { type: QueryTypes.SELECT }
    );

    // Se traen todos los medicamentos con su id y su nombre.
    const medicamentos = await context.sequelize.query<FilaConNombre>(
        "SELECT id, nombre FROM medicamentos",
        { type: QueryTypes.SELECT }
    );

    const ahora = new Date();
    const registros = [];

    // Por cada existencia de la lista se buscan los ids que le corresponden.
    for (const existencia of EXISTENCIAS_A_CARGAR) {
        const almacen = almacenes.find((fila) => fila.nombre === existencia.almacen);
        const medicamento = medicamentos.find(
            (fila) => fila.nombre === existencia.medicamento
        );

        // Si falta alguno es porque los seeders anteriores no se ejecutaron.
        if (!almacen) {
            throw new Error(`No se encontró el almacén "${existencia.almacen}".`);
        }

        if (!medicamento) {
            throw new Error(`No se encontró el medicamento "${existencia.medicamento}".`);
        }

        registros.push({
            id: randomUUID(),
            almacen_id: almacen.id,
            medicamento_id: medicamento.id,
            cantidad: existencia.cantidad,
            is_active: true,
            createdAt: ahora,
            updatedAt: ahora,
        });
    }

    await context.bulkInsert("inventario", registros);
}

/**
 * Deshace el seeder borrando todo el inventario.
 */
export async function down({ context }: { context: QueryInterface }): Promise<void> {
    await context.bulkDelete("inventario", {});
}
