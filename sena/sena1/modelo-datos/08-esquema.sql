-- ============================================================================
--  MODELO DE BASE DE DATOS  -  API RiwiMediCare Plus
--  Evidencia de producto  -  Norma 220501095
--
--  Motor      : PostgreSQL 16
--  Base       : db_nodejs
--  Aprendiz   : Dylan Alberto Suarez Laverde
--
--  Este guion crea la estructura completa del sistema: tipos enumerados,
--  tablas, llaves primarias, llaves foraneas y restricciones de integridad.
--
--  Corresponde exactamente al esquema que producen las migraciones
--  del proyecto (src/migrations/), ejecutadas con:  npm run migrate
--
--  El orden de creacion NO es arbitrario: una tabla con llave foranea
--  solo puede crearse despues de la tabla a la que referencia.
-- ============================================================================


-- ============================================================================
--  0. CREACION DE LA BASE DE DATOS
--     Ejecutar conectado a la base 'postgres', no a db_nodejs.
-- ============================================================================

-- CREATE DATABASE db_nodejs
--     WITH ENCODING 'UTF8'
--     LC_COLLATE = 'es_CO.UTF-8'
--     LC_CTYPE   = 'es_CO.UTF-8'
--     TEMPLATE   = template0;

-- \c db_nodejs


-- ============================================================================
--  1. TIPOS ENUMERADOS
--
--  PostgreSQL almacena los ENUM como tipos independientes de la tabla.
--  Se crean primero porque las tablas los usan como tipo de columna.
-- ============================================================================

-- Roles que puede tener un usuario dentro del sistema.
--   administrador : CRUD completo de todas las entidades.
--   gestor        : solo registra solicitudes y les cambia el estado.
CREATE TYPE enum_users_role AS ENUM (
    'administrador',
    'gestor'
);

-- Estados por los que puede pasar una solicitud de abastecimiento.
--   pendiente : estado inicial.
--   aprobada  : autorizada, el inventario ya fue descontado.
--   rechazada : denegada.            (estado final)
--   entregada : recibida en clinica. (estado final)
--   cancelada : anulada.             (estado final)
CREATE TYPE enum_solicitudes_estado AS ENUM (
    'pendiente',
    'aprobada',
    'rechazada',
    'entregada',
    'cancelada'
);


-- ============================================================================
--  2. TABLA  users
--
--  Personas que pueden autenticarse en la API.
--  La contrasena nunca se guarda en texto plano: se almacena el hash
--  que produce bcrypt con factor de costo 10.
-- ============================================================================

CREATE TABLE users (
    id             UUID          NOT NULL,
    first_name     VARCHAR(100)  NOT NULL,
    last_name      VARCHAR(100)  NOT NULL,
    email          VARCHAR(150)  NOT NULL,
    password_hash  VARCHAR(255)  NOT NULL,
    role           enum_users_role NOT NULL,
    is_active      BOOLEAN       NOT NULL DEFAULT true,
    "createdAt"    TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"    TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT users_pkey      PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

COMMENT ON TABLE  users               IS 'Usuarios que pueden autenticarse en la API';
COMMENT ON COLUMN users.password_hash IS 'Hash bcrypt de la contrasena, nunca texto plano';
COMMENT ON COLUMN users.is_active     IS 'false = usuario dado de baja logicamente';


-- ============================================================================
--  3. TABLA  clinicas
--
--  Centros de atencion que solicitan medicamentos.
--  Incluye los datos de la persona responsable a la que hay que contactar.
-- ============================================================================

CREATE TABLE clinicas (
    id                    UUID          NOT NULL,
    nombre                VARCHAR(150)  NOT NULL,
    nit                   VARCHAR(20)   NOT NULL,
    direccion             VARCHAR(200)  NOT NULL,
    telefono              VARCHAR(20)   NOT NULL,
    email                 VARCHAR(150)  NOT NULL,
    responsable_nombre    VARCHAR(150)  NOT NULL,
    responsable_email     VARCHAR(150)  NOT NULL,
    responsable_telefono  VARCHAR(20)   NOT NULL,
    is_active             BOOLEAN       NOT NULL DEFAULT true,
    "createdAt"           TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"           TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT clinicas_pkey    PRIMARY KEY (id),
    CONSTRAINT clinicas_nit_key UNIQUE (nit)
);

COMMENT ON TABLE  clinicas     IS 'Clinicas y centros de atencion atendidos por la empresa';
COMMENT ON COLUMN clinicas.nit IS 'Identificacion tributaria. Unica incluso entre clinicas dadas de baja';


-- ============================================================================
--  4. TABLA  almacenes
--
--  Depositos desde los que se despachan los medicamentos hacia las clinicas.
-- ============================================================================

CREATE TABLE almacenes (
    id           UUID          NOT NULL,
    nombre       VARCHAR(150)  NOT NULL,
    direccion    VARCHAR(200)  NOT NULL,
    telefono     VARCHAR(20)   NOT NULL,
    is_active    BOOLEAN       NOT NULL DEFAULT true,
    "createdAt"  TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"  TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT almacenes_pkey PRIMARY KEY (id)
);

COMMENT ON TABLE almacenes IS 'Almacenes de despacho de la empresa';


-- ============================================================================
--  5. TABLA  medicamentos
--
--  Catalogo de productos que la empresa distribuye.
--  La cantidad disponible NO vive aqui, sino en la tabla inventario,
--  porque un mismo medicamento existe en varios almacenes.
-- ============================================================================

CREATE TABLE medicamentos (
    id            UUID          NOT NULL,
    nombre        VARCHAR(150)  NOT NULL,
    descripcion   VARCHAR(255)  NOT NULL,
    presentacion  VARCHAR(100)  NOT NULL,
    laboratorio   VARCHAR(150)  NOT NULL,
    is_active     BOOLEAN       NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"   TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT medicamentos_pkey PRIMARY KEY (id)
);

COMMENT ON TABLE  medicamentos              IS 'Catalogo de medicamentos e insumos medicos';
COMMENT ON COLUMN medicamentos.presentacion IS 'Ejemplo: Caja x 30 tabletas, Frasco 120 ml';


-- ============================================================================
--  6. TABLA  inventario
--
--  Resuelve la relacion muchos a muchos entre almacenes y medicamentos,
--  aportando el atributo propio 'cantidad'.
--
--  Es la tabla que se consulta antes de aceptar una solicitud y la que
--  se descuenta cuando la solicitud se aprueba.
-- ============================================================================

CREATE TABLE inventario (
    id              UUID     NOT NULL,
    almacen_id      UUID     NOT NULL,
    medicamento_id  UUID     NOT NULL,
    cantidad        INTEGER  NOT NULL DEFAULT 0,
    is_active       BOOLEAN  NOT NULL DEFAULT true,
    "createdAt"     TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"     TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT inventario_pkey PRIMARY KEY (id),

    -- Llaves foraneas: garantizan que no exista inventario huerfano.
    CONSTRAINT inventario_almacen_id_fkey
        FOREIGN KEY (almacen_id)     REFERENCES almacenes(id),
    CONSTRAINT inventario_medicamento_id_fkey
        FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id),

    -- Un almacen no puede tener dos filas del mismo medicamento.
    CONSTRAINT inventario_almacen_medicamento_unico
        UNIQUE (almacen_id, medicamento_id),

    -- La cantidad nunca puede quedar en negativo, ni siquiera por un
    -- error de la aplicacion: la regla vive en la propia base de datos.
    CONSTRAINT inventario_cantidad_no_negativa
        CHECK (cantidad >= 0)
);

COMMENT ON TABLE  inventario          IS 'Unidades de cada medicamento disponibles en cada almacen';
COMMENT ON COLUMN inventario.cantidad IS 'Unidades disponibles. Se descuenta al aprobar una solicitud';


-- ============================================================================
--  7. TABLA  solicitudes
--
--  Nucleo del sistema: una clinica pide una cantidad de un medicamento
--  a un almacen determinado. Referencia a cuatro tablas.
-- ============================================================================

CREATE TABLE solicitudes (
    id                   UUID     NOT NULL,
    clinica_id           UUID     NOT NULL,
    medicamento_id       UUID     NOT NULL,
    almacen_id           UUID     NOT NULL,
    usuario_id           UUID     NOT NULL,
    cantidad_solicitada  INTEGER  NOT NULL,
    estado               enum_solicitudes_estado NOT NULL DEFAULT 'pendiente',
    observaciones        TEXT         NULL,
    is_active            BOOLEAN  NOT NULL DEFAULT true,
    "createdAt"          TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt"          TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT solicitudes_pkey PRIMARY KEY (id),

    CONSTRAINT solicitudes_clinica_id_fkey
        FOREIGN KEY (clinica_id)     REFERENCES clinicas(id),
    CONSTRAINT solicitudes_medicamento_id_fkey
        FOREIGN KEY (medicamento_id) REFERENCES medicamentos(id),
    CONSTRAINT solicitudes_almacen_id_fkey
        FOREIGN KEY (almacen_id)     REFERENCES almacenes(id),
    CONSTRAINT solicitudes_usuario_id_fkey
        FOREIGN KEY (usuario_id)     REFERENCES users(id),

    -- No se aceptan solicitudes de cero unidades ni de cantidades negativas.
    CONSTRAINT solicitudes_cantidad_mayor_a_cero
        CHECK (cantidad_solicitada > 0)
);

COMMENT ON TABLE  solicitudes               IS 'Solicitudes de abastecimiento de las clinicas';
COMMENT ON COLUMN solicitudes.usuario_id    IS 'Usuario que registro la solicitud, tomado del token JWT';
COMMENT ON COLUMN solicitudes.estado        IS 'Estado dentro del ciclo de vida de la solicitud';
COMMENT ON COLUMN solicitudes.observaciones IS 'Nota opcional que se adjunta al cambiar el estado';


-- ============================================================================
--  8. TABLAS DE CONTROL DE UMZUG
--
--  Registran que migraciones y que seeders ya se ejecutaron, para no
--  volver a aplicarlos. Las crea la propia herramienta.
-- ============================================================================

CREATE TABLE migrations (
    name VARCHAR(255) NOT NULL,
    CONSTRAINT migrations_pkey PRIMARY KEY (name)
);

CREATE TABLE "SequelizeData" (
    name VARCHAR(255) NOT NULL,
    CONSTRAINT "SequelizeData_pkey" PRIMARY KEY (name)
);


-- ============================================================================
--  9. INDICES RECOMENDADOS
--
--  PostgreSQL crea automaticamente un indice por cada PRIMARY KEY y por
--  cada UNIQUE, pero NO por las llaves foraneas. Los siguientes indices
--  aceleran las consultas mas frecuentes del sistema.
-- ============================================================================

-- Listado de solicitudes en curso (pendientes y aprobadas).
CREATE INDEX idx_solicitudes_estado_activa
    ON solicitudes (estado, is_active);

-- Historial de solicitudes de una clinica.
CREATE INDEX idx_solicitudes_clinica
    ON solicitudes (clinica_id);

-- Busqueda del registro de inventario a descontar al aprobar.
CREATE INDEX idx_inventario_almacen_medicamento
    ON inventario (almacen_id, medicamento_id);

-- Ordenamiento del historial por fecha descendente.
CREATE INDEX idx_solicitudes_creacion
    ON solicitudes ("createdAt" DESC);


-- ============================================================================
--  10. CONSULTAS DE VERIFICACION
--
--  Permiten comprobar que la estructura quedo correctamente creada.
-- ============================================================================

-- Listar las tablas creadas.
-- SELECT table_name
--   FROM information_schema.tables
--  WHERE table_schema = 'public'
--  ORDER BY table_name;

-- Listar las restricciones de una tabla.
-- SELECT conname, contype, pg_get_constraintdef(oid)
--   FROM pg_constraint
--  WHERE conrelid = 'solicitudes'::regclass;

-- Listar los valores de un tipo enumerado.
-- SELECT enumlabel
--   FROM pg_enum
--  WHERE enumtypid = 'enum_solicitudes_estado'::regtype
--  ORDER BY enumsortorder;


-- ============================================================================
--  11. REVERSION COMPLETA
--
--  Deshace todo lo creado por este guion. El orden es el inverso al de
--  creacion: primero las tablas que referencian, despues las referenciadas,
--  y al final los tipos enumerados.
-- ============================================================================

-- DROP TABLE IF EXISTS solicitudes;
-- DROP TABLE IF EXISTS inventario;
-- DROP TABLE IF EXISTS medicamentos;
-- DROP TABLE IF EXISTS almacenes;
-- DROP TABLE IF EXISTS clinicas;
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS migrations;
-- DROP TABLE IF EXISTS "SequelizeData";
-- DROP TYPE  IF EXISTS enum_solicitudes_estado;
-- DROP TYPE  IF EXISTS enum_users_role;


-- ============================================================================
--  FIN DEL GUION
-- ============================================================================
