import { Almacen } from "../models/index.js";
import type {
    ActualizarAlmacenInput,
    CrearAlmacenInput,
} from "../dto/almacen.schema.js";
import { HttpError } from "../utils/http-error.js";

/**
 * Devuelve todos los almacenes activos.
 */
export async function listarAlmacenes(): Promise<Almacen[]> {
    const almacenes = await Almacen.findAll({
        where: { is_active: true },
        order: [["nombre", "ASC"]],
    });

    return almacenes;
}

/**
 * Busca un almacén activo por su id.
 *
 * @param id Identificador UUID del almacén.
 * @throws HttpError 404 si el almacén no existe o está eliminado.
 */
export async function obtenerAlmacenPorId(id: string): Promise<Almacen> {
    const almacen = await Almacen.findOne({
        where: { id, is_active: true },
    });

    if (!almacen) {
        throw new HttpError(404, "El almacén no existe o fue eliminado.");
    }

    return almacen;
}

/**
 * Crea un almacén nuevo.
 *
 * @param datos Datos ya validados por crearAlmacenSchema.
 */
export async function crearAlmacen(datos: CrearAlmacenInput): Promise<Almacen> {
    const nuevoAlmacen = await Almacen.create({
        nombre: datos.nombre,
        direccion: datos.direccion,
        telefono: datos.telefono,
    });

    return nuevoAlmacen;
}

/**
 * Actualiza los datos de un almacén activo.
 *
 * @param id Identificador UUID del almacén.
 * @param datos Campos a modificar, ya validados.
 */
export async function actualizarAlmacen(
    id: string,
    datos: ActualizarAlmacenInput
): Promise<Almacen> {
    const almacen = await obtenerAlmacenPorId(id);

    await almacen.update(datos);

    return almacen;
}

/**
 * Elimina lógicamente un almacén: le pone is_active en false
 * en vez de borrar el registro, para no perder el historial
 * de solicitudes e inventario que lo referencian.
 *
 * @param id Identificador UUID del almacén.
 */
export async function eliminarAlmacen(id: string): Promise<void> {
    const almacen = await obtenerAlmacenPorId(id);

    await almacen.update({ is_active: false });
}
