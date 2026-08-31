import { Medicamento } from "../models/index.js";
import type {
    ActualizarMedicamentoInput,
    CrearMedicamentoInput,
} from "../dto/medicamento.schema.js";
import { HttpError } from "../utils/http-error.js";

/**
 * Devuelve todos los medicamentos activos del catálogo.
 */
export async function listarMedicamentos(): Promise<Medicamento[]> {
    const medicamentos = await Medicamento.findAll({
        where: { is_active: true },
        order: [["nombre", "ASC"]],
    });

    return medicamentos;
}

/**
 * Busca un medicamento activo por su id.
 *
 * @param id Identificador UUID del medicamento.
 * @throws HttpError 404 si el medicamento no existe o está eliminado.
 */
export async function obtenerMedicamentoPorId(id: string): Promise<Medicamento> {
    const medicamento = await Medicamento.findOne({
        where: { id, is_active: true },
    });

    if (!medicamento) {
        throw new HttpError(404, "El medicamento no existe o fue eliminado.");
    }

    return medicamento;
}

/**
 * Crea un medicamento nuevo en el catálogo.
 *
 * La cantidad disponible no se define aquí, sino en el inventario
 * de cada almacén.
 *
 * @param datos Datos ya validados por crearMedicamentoSchema.
 */
export async function crearMedicamento(
    datos: CrearMedicamentoInput
): Promise<Medicamento> {
    const nuevoMedicamento = await Medicamento.create({
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        presentacion: datos.presentacion,
        laboratorio: datos.laboratorio,
    });

    return nuevoMedicamento;
}

/**
 * Actualiza los datos de un medicamento activo.
 *
 * @param id Identificador UUID del medicamento.
 * @param datos Campos a modificar, ya validados.
 */
export async function actualizarMedicamento(
    id: string,
    datos: ActualizarMedicamentoInput
): Promise<Medicamento> {
    const medicamento = await obtenerMedicamentoPorId(id);

    await medicamento.update(datos);

    return medicamento;
}

/**
 * Elimina lógicamente un medicamento poniéndole is_active en false.
 *
 * @param id Identificador UUID del medicamento.
 */
export async function eliminarMedicamento(id: string): Promise<void> {
    const medicamento = await obtenerMedicamentoPorId(id);

    await medicamento.update({ is_active: false });
}
