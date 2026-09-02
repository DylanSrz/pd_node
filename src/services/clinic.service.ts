import { Clinic } from "../models/index.js";
import type {
    UpdateClinicInput,
    CreateClinicInput,
} from "../dto/clinic.schema.js";
import { HttpError } from "../utils/http-error.js";

/**
 * Returns every active clinic.
 *
 * The is_active: true filter is written here explicitly:
 * logically deleted clinics remain in the database,
 * but they are not shown in the listing.
 */
export async function listClinics(): Promise<Clinic[]> {
    const clinics = await Clinic.findAll({
        where: { is_active: true },
        order: [["name", "ASC"]],
    });

    return clinics;
}

/**
 * Looks for an active clinic by its id.
 *
 * @param id UUID identifier of the clinic.
 * @throws HttpError 404 if the clinic does not exist or is deleted.
 */
export async function findClinicById(id: string): Promise<Clinic> {
    const clinic = await Clinic.findOne({
        where: { id, is_active: true },
    });

    if (!clinic) {
        throw new HttpError(404, "The clinic does not exist or was deleted.");
    }

    return clinic;
}

/**
 * Creates a new clinic.
 *
 * That the tax id is not repeated was already checked by the
 * verifyUniqueTaxId middleware before getting here.
 *
 * @param data Data already validated by createClinicSchema.
 */
export async function createClinic(data: CreateClinicInput): Promise<Clinic> {
    const newClinic = await Clinic.create({
        name: data.name,
        tax_id: data.tax_id,
        address: data.address,
        phone: data.phone,
        email: data.email,
        manager_name: data.manager_name,
        manager_email: data.manager_email,
        manager_phone: data.manager_phone,
    });

    return newClinic;
}

/**
 * Updates the data of an active clinic.
 *
 * @param id UUID identifier of the clinic.
 * @param data Fields to modify, already validated.
 * @throws HttpError 404 if the clinic does not exist or is deleted.
 */
export async function updateClinic(
    id: string,
    data: UpdateClinicInput
): Promise<Clinic> {
    // The function above is reused, which already throws the 404
    // if the clinic does not exist.
    const clinic = await findClinicById(id);

    // update only changes the fields coming in "data".
    await clinic.update(data);

    return clinic;
}

/**
 * Logically deletes a clinic: it does not remove the record,
 * it only sets is_active to false.
 *
 * That way the history of requests that already reference it is kept.
 *
 * @param id UUID identifier of the clinic.
 * @throws HttpError 404 if the clinic does not exist or was already deleted.
 */
export async function removeClinic(id: string): Promise<void> {
    const clinic = await findClinicById(id);

    await clinic.update({ is_active: false });
}
