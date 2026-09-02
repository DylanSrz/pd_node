import type { RequestStatus } from "../types/enums.js";

/**
 * Map with the allowed status changes.
 *
 * For each status it lists which ones it can move to.
 * Final statuses have an empty list: there is no way out of them.
 *
 *   pending ──> approved ──> delivered   (final)
 *      │            └──────> cancelled   (final)
 *      ├─────> rejected                  (final)
 *      └─────> cancelled                 (final)
 */
export const ALLOWED_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
    pending: ["approved", "rejected", "cancelled"],
    approved: ["delivered", "cancelled"],
    rejected: [],
    delivered: [],
    cancelled: [],
};

/**
 * Tells whether a request can move from one status to another.
 *
 * @param currentStatus Status the request is in right now.
 * @param newStatus Status it is being changed to.
 * @returns true if the change is allowed.
 */
export function isValidTransition(
    currentStatus: RequestStatus,
    newStatus: RequestStatus
): boolean {
    const possibleStatuses = ALLOWED_TRANSITIONS[currentStatus];

    return possibleStatuses.includes(newStatus);
}

/**
 * Returns, as text, the statuses the request can actually move to.
 * Useful to build a clear error message for whoever consumes the API.
 *
 * @param currentStatus Status the request is in right now.
 */
export function possibleStatusesAsText(currentStatus: RequestStatus): string {
    const possibleStatuses = ALLOWED_TRANSITIONS[currentStatus];

    if (possibleStatuses.length === 0) {
        return "none, because it is a final status";
    }

    return possibleStatuses.join(", ");
}
