/**
 * Roles a user can have inside the system.
 *
 * - admin: can perform the full CRUD on every entity.
 * - manager: can only register requests and change their status.
 */
export const USER_ROLES = ["admin", "manager"] as const;

// Builds the type "admin" | "manager" out of the array above,
// so the roles do not have to be written twice.
export type UserRole = (typeof USER_ROLES)[number];

/**
 * Statuses a supply request can go through.
 *
 * - pending: initial status, right after the manager creates it.
 * - approved: the admin approved it and the inventory was already discounted.
 * - rejected: the admin rejected it.
 * - delivered: the medication reached the clinic.
 * - cancelled: the request was voided.
 */
export const REQUEST_STATUSES = [
    "pending",
    "approved",
    "rejected",
    "delivered",
    "cancelled",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];
