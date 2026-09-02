import { Medication } from "../models/index.js";
import type {
    UpdateMedicationInput,
    CreateMedicationInput,
} from "../dto/medication.schema.js";
import { HttpError } from "../utils/http-error.js";

/**
 * Returns every active medication of the catalog.
 */
export async function listMedications(): Promise<Medication[]> {
    const medications = await Medication.findAll({
        where: { is_active: true },
        order: [["name", "ASC"]],
    });

    return medications;
}

/**
 * Looks for an active medication by its id.
 *
 * @param id UUID identifier of the medication.
 * @throws HttpError 404 if the medication does not exist or is deleted.
 */
export async function findMedicationById(id: string): Promise<Medication> {
    const medication = await Medication.findOne({
        where: { id, is_active: true },
    });

    if (!medication) {
        throw new HttpError(404, "The medication does not exist or was deleted.");
    }

    return medication;
}

/**
 * Creates a new medication in the catalog.
 *
 * The available quantity is not defined here but in the inventory
 * of each warehouse.
 *
 * @param data Data already validated by createMedicationSchema.
 */
export async function createMedication(
    data: CreateMedicationInput
): Promise<Medication> {
    const newMedication = await Medication.create({
        name: data.name,
        description: data.description,
        presentation: data.presentation,
        laboratory: data.laboratory,
    });

    return newMedication;
}

/**
 * Updates the data of an active medication.
 *
 * @param id UUID identifier of the medication.
 * @param data Fields to modify, already validated.
 */
export async function updateMedication(
    id: string,
    data: UpdateMedicationInput
): Promise<Medication> {
    const medication = await findMedicationById(id);

    await medication.update(data);

    return medication;
}

/**
 * Logically deletes a medication by setting is_active to false.
 *
 * @param id UUID identifier of the medication.
 */
export async function removeMedication(id: string): Promise<void> {
    const medication = await findMedicationById(id);

    await medication.update({ is_active: false });
}
