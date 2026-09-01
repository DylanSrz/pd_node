import { Clinica } from "../models/index.js";
import type {
    ActualizarClinicaInput,
    CrearClinicaInput,
} from "../dto/clinica.schema.js";
import { HttpError } from "../utils/http-error.js";

/**
 * Devuelve todas las clínicas activas.
 *
 * El filtro is_active: true se escribe aquí de forma explícita:
 * las clínicas eliminadas lógicamente siguen en la base de datos,
 * pero no se muestran en el listado.
 */
export async function listarClinicas(): Promise<Clinica[]> {
    const clinicas = await Clinica.findAll({
        where: { is_active: true },
        order: [["nombre", "ASC"]],
    });

    return clinicas;
}

/**
 * Busca una clínica activa por su id.
 *
 * @param id Identificador UUID de la clínica.
 * @throws HttpError 404 si la clínica no existe o está eliminada.
 */
export async function obtenerClinicaPorId(id: string): Promise<Clinica> {
    const clinica = await Clinica.findOne({
        where: { id, is_active: true },
    });

    if (!clinica) {
        throw new HttpError(404, "La clínica no existe o fue eliminada.");
    }

    return clinica;
}

/**
 * Crea una clínica nueva.
 *
 * Que el NIT no esté repetido ya lo revisó el middleware
 * verificarNitUnico antes de llegar aquí.
 *
 * @param datos Datos ya validados por crearClinicaSchema.
 */
export async function crearClinica(datos: CrearClinicaInput): Promise<Clinica> {
    const nuevaClinica = await Clinica.create({
        nombre: datos.nombre,
        nit: datos.nit,
        direccion: datos.direccion,
        telefono: datos.telefono,
        email: datos.email,
        responsable_nombre: datos.responsable_nombre,
        responsable_email: datos.responsable_email,
        responsable_telefono: datos.responsable_telefono,
    });

    return nuevaClinica;
}

/**
 * Actualiza los datos de una clínica activa.
 *
 * @param id Identificador UUID de la clínica.
 * @param datos Campos a modificar, ya validados.
 * @throws HttpError 404 si la clínica no existe o está eliminada.
 */
export async function actualizarClinica(
    id: string,
    datos: ActualizarClinicaInput
): Promise<Clinica> {
    // Se reutiliza la función de arriba, que ya lanza el 404
    // si la clínica no existe.
    const clinica = await obtenerClinicaPorId(id);

    // update solo cambia los campos que vengan en "datos".
    await clinica.update(datos);

    return clinica;
}

/**
 * Elimina lógicamente una clínica: no borra el registro,
 * solo le pone is_active en false.
 *
 * Así se conserva el historial de solicitudes que ya la referencian.
 *
 * @param id Identificador UUID de la clínica.
 * @throws HttpError 404 si la clínica no existe o ya estaba eliminada.
 */
export async function eliminarClinica(id: string): Promise<void> {
    const clinica = await obtenerClinicaPorId(id);

    await clinica.update({ is_active: false });
}
