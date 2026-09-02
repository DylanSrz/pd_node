import { Warehouse } from "../models/index.js";
import type {
    UpdateWarehouseInput,
    CreateWarehouseInput,
} from "../dto/warehouse.schema.js";
import { HttpError } from "../utils/http-error.js";

/**
 * Returns every active warehouse.
 */
export async function listWarehouses(): Promise<Warehouse[]> {
    const warehouses = await Warehouse.findAll({
        where: { is_active: true },
        order: [["name", "ASC"]],
    });

    return warehouses;
}

/**
 * Looks for an active warehouse by its id.
 *
 * @param id UUID identifier of the warehouse.
 * @throws HttpError 404 if the warehouse does not exist or is deleted.
 */
export async function findWarehouseById(id: string): Promise<Warehouse> {
    const warehouse = await Warehouse.findOne({
        where: { id, is_active: true },
    });

    if (!warehouse) {
        throw new HttpError(404, "The warehouse does not exist or was deleted.");
    }

    return warehouse;
}

/**
 * Creates a new warehouse.
 *
 * @param data Data already validated by createWarehouseSchema.
 */
export async function createWarehouse(data: CreateWarehouseInput): Promise<Warehouse> {
    const newWarehouse = await Warehouse.create({
        name: data.name,
        address: data.address,
        phone: data.phone,
    });

    return newWarehouse;
}

/**
 * Updates the data of an active warehouse.
 *
 * @param id UUID identifier of the warehouse.
 * @param data Fields to modify, already validated.
 */
export async function updateWarehouse(
    id: string,
    data: UpdateWarehouseInput
): Promise<Warehouse> {
    const warehouse = await findWarehouseById(id);

    await warehouse.update(data);

    return warehouse;
}

/**
 * Logically deletes a warehouse: it sets is_active to false
 * instead of removing the record, so the history of requests
 * and inventory that reference it is not lost.
 *
 * @param id UUID identifier of the warehouse.
 */
export async function removeWarehouse(id: string): Promise<void> {
    const warehouse = await findWarehouseById(id);

    await warehouse.update({ is_active: false });
}
