import { Almacen, Inventario, Medicamento } from "../models/index.js";
import type {
    ActualizarInventarioInput,
    CrearInventarioInput,
} from "../dto/inventario.schema.js";
import { obtenerAlmacenPorId } from "./almacen.service.js";
import { obtenerMedicamentoPorId } from "./medicamento.service.js";
import { HttpError } from "../utils/http-error.js";

// Al consultar el inventario siempre se traen también los datos
// del almacén y del medicamento, para no devolver solo los ids.
const incluirAlmacenYMedicamento = [
    {
        model: Almacen,
        as: "almacen",
        attributes: ["id", "nombre", "direccion"],
    },
    {
        model: Medicamento,
        as: "medicamento",
        attributes: ["id", "nombre", "presentacion", "laboratorio"],
    },
];

/**
 * Devuelve todos los registros de inventario activos,
 * con el almacén y el medicamento al que pertenecen.
 */
export async function listarInventario(): Promise<Inventario[]> {
    const inventario = await Inventario.findAll({
        where: { is_active: true },
        include: incluirAlmacenYMedicamento,
        order: [["createdAt", "ASC"]],
    });

    return inventario;
}

/**
 * Busca un registro de inventario activo por su id.
 *
 * @param id Identificador UUID del registro de inventario.
 * @throws HttpError 404 si no existe o está eliminado.
 */
export async function obtenerInventarioPorId(id: string): Promise<Inventario> {
    const registro = await Inventario.findOne({
        where: { id, is_active: true },
        include: incluirAlmacenYMedicamento,
    });

    if (!registro) {
        throw new HttpError(404, "El registro de inventario no existe o fue eliminado.");
    }

    return registro;
}

/**
 * Busca cuántas unidades de un medicamento hay en un almacén.
 *
 * Esta función la usa el módulo de solicitudes para revisar
 * si hay existencias suficientes antes de aprobar un pedido.
 *
 * @param almacenId Identificador UUID del almacén.
 * @param medicamentoId Identificador UUID del medicamento.
 * @returns El registro de inventario, o null si ese almacén
 *          nunca ha manejado ese medicamento.
 */
export async function buscarInventario(
    almacenId: string,
    medicamentoId: string
): Promise<Inventario | null> {
    const registro = await Inventario.findOne({
        where: {
            almacen_id: almacenId,
            medicamento_id: medicamentoId,
            is_active: true,
        },
    });

    return registro;
}

/**
 * Registra las existencias de un medicamento en un almacén.
 *
 * Antes de crear se revisa que el almacén y el medicamento existan,
 * y que ese par no esté ya registrado.
 *
 * @param datos Datos ya validados por crearInventarioSchema.
 * @throws HttpError 404 si el almacén o el medicamento no existen.
 * @throws HttpError 409 si ese medicamento ya está registrado
 *         en ese almacén.
 */
export async function crearInventario(
    datos: CrearInventarioInput
): Promise<Inventario> {
    // Estas dos funciones ya lanzan un 404 si no encuentran el registro.
    await obtenerAlmacenPorId(datos.almacen_id);
    await obtenerMedicamentoPorId(datos.medicamento_id);

    const registroExistente = await buscarInventario(
        datos.almacen_id,
        datos.medicamento_id
    );

    if (registroExistente) {
        throw new HttpError(
            409,
            "Ese medicamento ya está registrado en ese almacén. Actualice la cantidad en lugar de crearlo de nuevo."
        );
    }

    const nuevoRegistro = await Inventario.create({
        almacen_id: datos.almacen_id,
        medicamento_id: datos.medicamento_id,
        cantidad: datos.cantidad,
    });

    // Se vuelve a consultar para devolverlo con el almacén
    // y el medicamento incluidos.
    return obtenerInventarioPorId(nuevoRegistro.id);
}

/**
 * Cambia la cantidad disponible de un registro de inventario.
 *
 * @param id Identificador UUID del registro.
 * @param datos Nueva cantidad, ya validada.
 */
export async function actualizarInventario(
    id: string,
    datos: ActualizarInventarioInput
): Promise<Inventario> {
    const registro = await obtenerInventarioPorId(id);

    await registro.update({ cantidad: datos.cantidad });

    return registro;
}

/**
 * Elimina lógicamente un registro de inventario.
 *
 * @param id Identificador UUID del registro.
 */
export async function eliminarInventario(id: string): Promise<void> {
    const registro = await obtenerInventarioPorId(id);

    await registro.update({ is_active: false });
}
