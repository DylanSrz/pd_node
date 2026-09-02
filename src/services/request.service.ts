import { Transaction } from "sequelize";

import db from "../config/db.js";
import {
    Warehouse,
    Clinic,
    Inventory,
    Medication,
    Request as SupplyRequest,
    User,
} from "../models/index.js";
import type {
    UpdateRequestInput,
    ChangeStatusInput,
    CreateRequestInput,
} from "../dto/request.schema.js";
import { findClinicById } from "./clinic.service.js";
import { HttpError } from "../utils/http-error.js";

// When querying requests the data of the related tables is always
// brought along, so as not to return a meaningless list of UUIDs.
const includeRelations = [
    {
        model: Clinic,
        as: "clinic",
        attributes: ["id", "name", "tax_id", "manager_name"],
    },
    {
        model: Medication,
        as: "medication",
        attributes: ["id", "name", "presentation"],
    },
    {
        model: Warehouse,
        as: "warehouse",
        attributes: ["id", "name"],
    },
    {
        model: User,
        as: "user",
        attributes: ["id", "first_name", "last_name", "email"],
    },
];

/**
 * Returns the active requests, that is, the ones that are still
 * in progress: pending or approved.
 *
 * The rejected, delivered and cancelled ones already finished their
 * cycle, so they are queried in the history.
 */
export async function listActiveRequests(): Promise<SupplyRequest[]> {
    const requests = await SupplyRequest.findAll({
        where: {
            is_active: true,
            status: ["pending", "approved"],
        },
        include: includeRelations,
        order: [["createdAt", "DESC"]],
    });

    return requests;
}

/**
 * Returns the full history of requests.
 *
 * Here there is no filter by status nor by is_active on purpose:
 * the history must show everything that has happened, including
 * the logically deleted requests.
 */
export async function listRequestHistory(): Promise<SupplyRequest[]> {
    const requests = await SupplyRequest.findAll({
        include: includeRelations,
        order: [["createdAt", "DESC"]],
    });

    return requests;
}

/**
 * Returns the request history of a clinic.
 *
 * @param clinicId UUID identifier of the clinic.
 * @throws HttpError 404 if the clinic does not exist or was deleted.
 */
export async function listRequestsByClinic(
    clinicId: string
): Promise<SupplyRequest[]> {
    // The clinics service is reused, which already throws the 404.
    await findClinicById(clinicId);

    const requests = await SupplyRequest.findAll({
        where: { clinic_id: clinicId },
        include: includeRelations,
        order: [["createdAt", "DESC"]],
    });

    return requests;
}

/**
 * Looks for an active request by its id.
 *
 * @param id UUID identifier of the request.
 * @throws HttpError 404 if the request does not exist or was deleted.
 */
export async function findRequestById(id: string): Promise<SupplyRequest> {
    const supplyRequest = await SupplyRequest.findOne({
        where: { id, is_active: true },
        include: includeRelations,
    });

    if (!supplyRequest) {
        throw new HttpError(404, "The request does not exist or was deleted.");
    }

    return supplyRequest;
}

/**
 * Registers a supply request.
 *
 * By the time it gets here, the middlewares already checked that the
 * clinic, the medication and the warehouse exist, and that there is
 * enough inventory. The inventory is not discounted yet: that happens
 * when the request is approved.
 *
 * @param data Data already validated by createRequestSchema.
 * @param userId Id of the user making the request, taken from the token.
 */
export async function createRequest(
    data: CreateRequestInput,
    userId: string
): Promise<SupplyRequest> {
    const newRequest = await SupplyRequest.create({
        clinic_id: data.clinic_id,
        medication_id: data.medication_id,
        warehouse_id: data.warehouse_id,
        user_id: userId,
        requested_quantity: data.requested_quantity,
        notes: data.notes ?? null,

        // Every request is born pending.
        status: "pending",
    });

    // It is queried again in order to return it with the relations included.
    return findRequestById(newRequest.id);
}

/**
 * Changes the status of a request and adjusts the inventory.
 *
 * That the status change is valid was already checked by the
 * verifyStatusTransition middleware. Here the effect on the stock
 * is applied:
 *
 * - When moving to 'approved' the units are discounted from the warehouse.
 * - When cancelling a request that was approved, they are given back.
 *
 * Everything is done inside a transaction: if something fails halfway
 * through, the status is not left changed with the inventory unadjusted.
 *
 * @param id UUID identifier of the request.
 * @param data New status and notes, already validated.
 */
export async function changeRequestStatus(
    id: string,
    data: ChangeStatusInput
): Promise<SupplyRequest> {
    const transaction = await db.transaction();

    try {
        const supplyRequest = await SupplyRequest.findOne({
            where: { id, is_active: true },
            transaction: transaction,
        });

        if (!supplyRequest) {
            throw new HttpError(404, "The request does not exist or was deleted.");
        }

        const previousStatus = supplyRequest.status;

        // Case 1: the request is approved, the inventory has to be discounted.
        if (data.status === "approved") {
            const inventoryRecord = await Inventory.findOne({
                where: {
                    warehouse_id: supplyRequest.warehouse_id,
                    medication_id: supplyRequest.medication_id,
                    is_active: true,
                },
                transaction: transaction,

                // Locks the row until the transaction ends, so that
                // two simultaneous approvals do not discount the same stock.
                lock: Transaction.LOCK.UPDATE,
            });

            if (!inventoryRecord) {
                throw new HttpError(
                    400,
                    "The warehouse no longer handles that medication, it cannot be approved."
                );
            }

            // The quantity is checked again: between the moment the request
            // was created and now, another approval could have consumed the
            // inventory.
            if (inventoryRecord.quantity < supplyRequest.requested_quantity) {
                throw new HttpError(
                    400,
                    `Not enough inventory to approve. Available: ${inventoryRecord.quantity}, requested: ${supplyRequest.requested_quantity}.`
                );
            }

            await inventoryRecord.update(
                { quantity: inventoryRecord.quantity - supplyRequest.requested_quantity },
                { transaction: transaction }
            );
        }

        // Case 2: a request that was already approved gets cancelled,
        // the units have to be given back to the warehouse.
        if (data.status === "cancelled" && previousStatus === "approved") {
            const inventoryRecord = await Inventory.findOne({
                where: {
                    warehouse_id: supplyRequest.warehouse_id,
                    medication_id: supplyRequest.medication_id,
                    is_active: true,
                },
                transaction: transaction,
                lock: Transaction.LOCK.UPDATE,
            });

            if (inventoryRecord) {
                await inventoryRecord.update(
                    {
                        quantity:
                            inventoryRecord.quantity + supplyRequest.requested_quantity,
                    },
                    { transaction: transaction }
                );
            }
        }

        // Once the inventory is adjusted, the new status is saved.
        await supplyRequest.update(
            {
                status: data.status,
                notes: data.notes ?? supplyRequest.notes,
            },
            { transaction: transaction }
        );

        // commit confirms every change of the transaction.
        await transaction.commit();

        return findRequestById(id);
    } catch (error) {
        // rollback undoes everything that was done so far.
        await transaction.rollback();

        throw error;
    }
}

/**
 * Fixes the quantity or the notes of a request.
 *
 * It is only allowed while the request is still pending: once
 * approved the inventory was already discounted, and changing its
 * quantity would leave the stock out of balance.
 *
 * @param id UUID identifier of the request.
 * @param data Fields to modify, already validated.
 */
export async function updateRequest(
    id: string,
    data: UpdateRequestInput
): Promise<SupplyRequest> {
    const supplyRequest = await findRequestById(id);

    if (supplyRequest.status !== "pending") {
        throw new HttpError(
            409,
            `Only a pending request can be modified. This one is in the '${supplyRequest.status}' status.`
        );
    }

    // If the quantity is changed, it has to be checked that the warehouse
    // still has enough stock.
    if (data.requested_quantity !== undefined) {
        const inventoryRecord = await Inventory.findOne({
            where: {
                warehouse_id: supplyRequest.warehouse_id,
                medication_id: supplyRequest.medication_id,
                is_active: true,
            },
        });

        if (!inventoryRecord) {
            throw new HttpError(400, "The warehouse no longer handles that medication.");
        }

        if (inventoryRecord.quantity < data.requested_quantity) {
            throw new HttpError(
                400,
                `The warehouse does not have enough inventory. Available: ${inventoryRecord.quantity}.`
            );
        }
    }

    await supplyRequest.update(data);

    return findRequestById(id);
}

/**
 * Logically deletes a request by setting is_active to false.
 *
 * If the request was approved, the units that had been discounted
 * are given back to the warehouse.
 *
 * @param id UUID identifier of the request.
 */
export async function removeRequest(id: string): Promise<void> {
    const transaction = await db.transaction();

    try {
        const supplyRequest = await SupplyRequest.findOne({
            where: { id, is_active: true },
            transaction: transaction,
        });

        if (!supplyRequest) {
            throw new HttpError(404, "The request does not exist or was deleted.");
        }

        // An approved request has reserved inventory that has to be
        // given back before taking it down.
        if (supplyRequest.status === "approved") {
            const inventoryRecord = await Inventory.findOne({
                where: {
                    warehouse_id: supplyRequest.warehouse_id,
                    medication_id: supplyRequest.medication_id,
                    is_active: true,
                },
                transaction: transaction,
                lock: Transaction.LOCK.UPDATE,
            });

            if (inventoryRecord) {
                await inventoryRecord.update(
                    {
                        quantity:
                            inventoryRecord.quantity + supplyRequest.requested_quantity,
                    },
                    { transaction: transaction }
                );
            }
        }

        await supplyRequest.update({ is_active: false }, { transaction: transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();

        throw error;
    }
}
