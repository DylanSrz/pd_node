import User from "./user.model.js";
import Clinic from "./clinic.model.js";
import Warehouse from "./warehouse.model.js";
import Medication from "./medication.model.js";
import Inventory from "./inventory.model.js";
import Request from "./request.model.js";

// ======================================================
// ASSOCIATIONS BETWEEN THE MODELS
// ======================================================
//
// Every relation is declared here, in a single place,
// so that no model has to import another one and thus
// circular imports are avoided.

// ------------------------------------------------------
// INVENTORY
// ------------------------------------------------------
//
// An inventory record belongs to a warehouse
// and to a medication.
//
//   Warehouse 1 ──── N Inventory N ──── 1 Medication

Inventory.belongsTo(Warehouse, {
    foreignKey: "warehouse_id",
    as: "warehouse",
});

Warehouse.hasMany(Inventory, {
    foreignKey: "warehouse_id",
    as: "inventory",
});

Inventory.belongsTo(Medication, {
    foreignKey: "medication_id",
    as: "medication",
});

Medication.hasMany(Inventory, {
    foreignKey: "medication_id",
    as: "inventory",
});

// ------------------------------------------------------
// REQUESTS
// ------------------------------------------------------
//
// A request points to four tables: the clinic that asks,
// the requested medication, the assigned warehouse and the user
// who registered it.

Request.belongsTo(Clinic, {
    foreignKey: "clinic_id",
    as: "clinic",
});

Clinic.hasMany(Request, {
    foreignKey: "clinic_id",
    as: "requests",
});

Request.belongsTo(Medication, {
    foreignKey: "medication_id",
    as: "medication",
});

Medication.hasMany(Request, {
    foreignKey: "medication_id",
    as: "requests",
});

Request.belongsTo(Warehouse, {
    foreignKey: "warehouse_id",
    as: "warehouse",
});

Warehouse.hasMany(Request, {
    foreignKey: "warehouse_id",
    as: "requests",
});

Request.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
});

User.hasMany(Request, {
    foreignKey: "user_id",
    as: "requests",
});

// They are exported all together so they can be imported
// comfortably from the services.
export { User, Clinic, Warehouse, Medication, Inventory, Request };
