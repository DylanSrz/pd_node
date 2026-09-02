import { Warehouse, Inventory, Medication } from "../models/index.js";
import type {
    UpdateInventoryInput,
    CreateInventoryInput,
} from "../dto/inventory.schema.js";
import { findWarehouseById } from "./warehouse.service.js";
import { findMedicationById } from "./medication.service.js";
import { HttpError } from "../utils/http-error.js";

// When querying the inventory the data of the warehouse and of the
// medication is always brought along, so as not to return only the ids.
const includeWarehouseAndMedication = [
    {
        model: Warehouse,
        as: "warehouse",
        attributes: ["id", "name", "address"],
    },
    {
        model: Medication,
        as: "medication",
        attributes: ["id", "name", "presentation", "laboratory"],
    },
];

/**
 * Returns every active inventory record,
 * with the warehouse and the medication it belongs to.
 */
export async function listInventory(): Promise<Inventory[]> {
    const inventory = await Inventory.findAll({
        where: { is_active: true },
        include: includeWarehouseAndMedication,
        order: [["createdAt", "ASC"]],
    });

    return inventory;
}

/**
 * Looks for an active inventory record by its id.
 *
 * @param id UUID identifier of the inventory record.
 * @throws HttpError 404 if it does not exist or is deleted.
 */
export async function findInventoryById(id: string): Promise<Inventory> {
    const record = await Inventory.findOne({
        where: { id, is_active: true },
        include: includeWarehouseAndMedication,
    });

    if (!record) {
        throw new HttpError(404, "The inventory record does not exist or was deleted.");
    }

    return record;
}

/**
 * Looks for how many units of a medication there are in a warehouse.
 *
 * This function is used by the requests module to check
 * whether there is enough stock before approving an order.
 *
 * @param warehouseId UUID identifier of the warehouse.
 * @param medicationId UUID identifier of the medication.
 * @returns The inventory record, or null if that warehouse
 *          has never handled that medication.
 */
export async function findInventoryRecord(
    warehouseId: string,
    medicationId: string
): Promise<Inventory | null> {
    const record = await Inventory.findOne({
        where: {
            warehouse_id: warehouseId,
            medication_id: medicationId,
            is_active: true,
        },
    });

    return record;
}

/**
 * Registers the stock of a medication in a warehouse.
 *
 * Before creating, it is checked that the warehouse and the medication
 * exist, and that the pair is not already registered.
 *
 * @param data Data already validated by createInventorySchema.
 * @throws HttpError 404 if the warehouse or the medication do not exist.
 * @throws HttpError 409 if that medication is already registered
 *         in that warehouse.
 */
export async function createInventory(
    data: CreateInventoryInput
): Promise<Inventory> {
    // These two functions already throw a 404 if they do not find the record.
    await findWarehouseById(data.warehouse_id);
    await findMedicationById(data.medication_id);

    const existingRecord = await findInventoryRecord(
        data.warehouse_id,
        data.medication_id
    );

    if (existingRecord) {
        throw new HttpError(
            409,
            "That medication is already registered in that warehouse. Update the quantity instead of creating it again."
        );
    }

    const newRecord = await Inventory.create({
        warehouse_id: data.warehouse_id,
        medication_id: data.medication_id,
        quantity: data.quantity,
    });

    // It is queried again in order to return it with the warehouse
    // and the medication included.
    return findInventoryById(newRecord.id);
}

/**
 * Changes the available quantity of an inventory record.
 *
 * @param id UUID identifier of the record.
 * @param data New quantity, already validated.
 */
export async function updateInventory(
    id: string,
    data: UpdateInventoryInput
): Promise<Inventory> {
    const record = await findInventoryById(id);

    await record.update({ quantity: data.quantity });

    return record;
}

/**
 * Logically deletes an inventory record.
 *
 * @param id UUID identifier of the record.
 */
export async function removeInventory(id: string): Promise<void> {
    const record = await findInventoryById(id);

    await record.update({ is_active: false });
}
