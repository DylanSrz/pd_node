import User from "./user.model.js";
import Clinica from "./clinica.model.js";
import Almacen from "./almacen.model.js";
import Medicamento from "./medicamento.model.js";
import Inventario from "./inventario.model.js";
import Solicitud from "./solicitud.model.js";

// ======================================================
// ASOCIACIONES ENTRE LOS MODELOS
// ======================================================
//
// Todas las relaciones se declaran aquí, en un solo lugar,
// para que ningún modelo tenga que importar a otro y así
// evitar imports circulares.

// ------------------------------------------------------
// INVENTARIO
// ------------------------------------------------------
//
// Un registro de inventario pertenece a un almacén
// y a un medicamento.
//
//   Almacen 1 ──── N Inventario N ──── 1 Medicamento

Inventario.belongsTo(Almacen, {
    foreignKey: "almacen_id",
    as: "almacen",
});

Almacen.hasMany(Inventario, {
    foreignKey: "almacen_id",
    as: "inventario",
});

Inventario.belongsTo(Medicamento, {
    foreignKey: "medicamento_id",
    as: "medicamento",
});

Medicamento.hasMany(Inventario, {
    foreignKey: "medicamento_id",
    as: "inventario",
});

// ------------------------------------------------------
// SOLICITUDES
// ------------------------------------------------------
//
// Una solicitud apunta a cuatro tablas: la clínica que pide,
// el medicamento pedido, el almacén asignado y el usuario
// que la registró.

Solicitud.belongsTo(Clinica, {
    foreignKey: "clinica_id",
    as: "clinica",
});

Clinica.hasMany(Solicitud, {
    foreignKey: "clinica_id",
    as: "solicitudes",
});

Solicitud.belongsTo(Medicamento, {
    foreignKey: "medicamento_id",
    as: "medicamento",
});

Medicamento.hasMany(Solicitud, {
    foreignKey: "medicamento_id",
    as: "solicitudes",
});

Solicitud.belongsTo(Almacen, {
    foreignKey: "almacen_id",
    as: "almacen",
});

Almacen.hasMany(Solicitud, {
    foreignKey: "almacen_id",
    as: "solicitudes",
});

Solicitud.belongsTo(User, {
    foreignKey: "usuario_id",
    as: "usuario",
});

User.hasMany(Solicitud, {
    foreignKey: "usuario_id",
    as: "solicitudes",
});

// Se exportan todos juntos para importarlos cómodamente
// desde los services.
export { User, Clinica, Almacen, Medicamento, Inventario, Solicitud };
