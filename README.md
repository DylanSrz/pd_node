# API RiwiMediCare Plus

API REST para gestionar el ciclo de vida de las solicitudes de abastecimiento de medicamentos e insumos médicos de la empresa **RiwiMediCare Plus**.

Permite registrar clínicas y sus responsables, administrar el inventario de medicamentos de cada almacén, crear solicitudes de abastecimiento, asignarlas a un almacén, controlar su estado y consultar el historial de solicitudes de cada clínica.

---

## Datos del proyecto

| | |
|---|---|
| **Coder** | Dylan Alberto Suárez Laverde |
| **Clan** | centurion |
| **Prueba** | Prueba de desempeño – Node.js |
| **Repositorio** | https://github.com/DylanSrz/pd_node |

---

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| **Node.js 18+** | Entorno de ejecución |
| **TypeScript** | Tipado estático en todo el proyecto |
| **Express 5** | Framework del servidor HTTP |
| **PostgreSQL 16** | Base de datos relacional |
| **Sequelize 6** | ORM para hablar con la base de datos |
| **Umzug** | Ejecuta las migraciones y los seeders por comando |
| **JSON Web Token** | Autenticación y protección de las rutas |
| **bcrypt** | Cifrado de las contraseñas |
| **Zod** | Validación de los datos que entran a la API |
| **Swagger (swagger-jsdoc + swagger-ui-express)** | Documentación de los endpoints |
| **Docker y Docker Compose** | Levantar la API y la base de datos en contenedores |
| **tsx** | Ejecutar TypeScript en desarrollo con recarga automática |

---

## Instalación

### Requisitos previos

- Node.js 18 o superior
- PostgreSQL 16 (o Docker, si se prefiere la opción con contenedores)
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/DylanSrz/pd_node.git
cd pd_node

# 2. Instalar las dependencias
npm install

# 3. Crear el archivo de variables de entorno
cp .env.example .env
#    Editar el .env con los datos de la base de datos propia

# 4. Crear las tablas
npm run migrate

# 5. Cargar los datos de prueba
npm run seed

# 6. Levantar el servidor
npm run dev
```

La API queda disponible en `http://localhost:3000` y la documentación en `http://localhost:3000/api-docs`.

---

## Variables de entorno

El archivo `.env` no se sube al repositorio. Se crea a partir de `.env.example`:

```env
# Puerto en el que se levanta la API
PORT=3000

# Datos de conexión a PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=admin
DATABASE_PASSWORD=admin1234
DATABASE_NAME=db_nodejs

# Clave secreta para firmar los JSON Web Token
JWT_SECRET=a3sd21m16uio87ft62mp4i0ok6j8b24sdfc6sd

# Tiempo de vida del token (ejemplos: 1h, 8h, 7d)
JWT_EXPIRES_IN=8h
```

---

## Ejecución del proyecto

### Modo desarrollo

Levanta el servidor y lo recarga solo cada vez que se guarda un archivo:

```bash
npm run dev
```

### Modo producción

Compila el TypeScript a JavaScript en la carpeta `dist` y ejecuta el resultado:

```bash
npm run build
npm start
```

### Con Docker

Levanta dos contenedores: la API y PostgreSQL, conectados por una red interna y con un volumen para que los datos sobrevivan al apagado.

```bash
# Levantar todo
docker compose up -d

# Ver los logs de la API
docker compose logs -f api

# Crear las tablas y cargar los datos dentro del contenedor
docker compose exec api npm run migrate
docker compose exec api npm run seed

# Apagar todo
docker compose down
```

---

## Migraciones y seeders

Las tablas **no** se crean con `sequelize.sync()`, sino con migraciones versionadas que se ejecutan por comando. Los seeders funcionan igual y cargan los datos de prueba.

| Comando | Qué hace |
|---|---|
| `npm run migrate` | Crea todas las tablas que falten |
| `npm run migrate:reverse` | Deshace la última migración |
| `npm run migrate:reset` | Deshace todas las migraciones |
| `npm run seed` | Carga todos los datos de prueba |
| `npm run seed:down` | Deshace el último seeder |
| `npm run seed:reset` | Deshace todos los seeders |

### Cómo ejecutar los seeders

```bash
# 1. Primero las tablas
npm run migrate

# 2. Después los datos
npm run seed
```

Salida esperada:

```
{ event: 'migrating', name: '010-users.seed.ts' }
{ event: 'migrated',  name: '010-users.seed.ts' }
...
Seeders executed successfully
```

Los seeders se ejecutan **en orden numérico**, porque cada uno depende del anterior: el inventario necesita que ya existan los almacenes y los medicamentos, y las solicitudes necesitan que existan las clínicas, los usuarios y el inventario.

Como los identificadores son UUID generados al azar en cada ejecución, los seeders no los escriben a mano: consultan las tablas anteriores y buscan los registros por su nombre (o por el correo, en el caso de los usuarios).

### Datos que se cargan

| Tabla | Registros |
|---|---|
| `users` | 4 (2 administradores y 2 gestores) |
| `clinicas` | 3 |
| `almacenes` | 2 |
| `medicamentos` | 6 |
| `inventario` | 9 |
| `solicitudes` | 6 (una por cada estado) |

Para revertirlo todo y volver a empezar de cero:

```bash
npm run seed:reset      # 1. limpia el registro de los seeders
npm run migrate:reset   # 2. borra las tablas
npm run migrate         # 3. las vuelve a crear
npm run seed            # 4. carga los datos otra vez
```

> **El orden importa.** `migrate:reset` borra las tablas del dominio, pero el
> registro que Umzug lleva de los seeders sobrevive en la tabla `SequelizeData`.
> Si no se ejecuta `seed:reset` primero, `npm run seed` cree que los seeders ya
> se ejecutaron, no vuelve a cargar nada y las tablas quedan vacías.

### Usuarios de prueba

| Correo | Contraseña | Rol |
|---|---|---|
| dylan.suarez@riwimedicare.com | `admin1234` | administrador |
| camilo.delvalle@riwimedicare.com | `admin1234` | administrador |
| abrahan.villa@riwimedicare.com | `gestor1234` | gestor |
| laura.restrepo@riwimedicare.com | `gestor1234` | gestor |

---

## Documentación de la API

Con el servidor arriba, la documentación interactiva queda en:

**http://localhost:3000/api-docs**

Para probar los endpoints protegidos:

1. Ejecutar `POST /api/auth/login` con uno de los usuarios de prueba.
2. Copiar el valor de `token` de la respuesta.
3. Pulsar el botón **Authorize** y pegar el token (sin escribir la palabra `Bearer`).
4. Ya se pueden ejecutar todos los demás endpoints.

---

## Endpoints

Todas las rutas exigen token, **salvo el registro y el inicio de sesión**.

### Autenticación

| Método | Ruta | Acceso |
|---|---|---|
| `POST` | `/api/auth/register` | Público |
| `POST` | `/api/auth/login` | Público |

### Clínicas

| Método | Ruta | Acceso |
|---|---|---|
| `GET` | `/api/clinicas` | Autenticado |
| `GET` | `/api/clinicas/:id` | Autenticado |
| `GET` | `/api/clinicas/:id/solicitudes` | Autenticado |
| `POST` | `/api/clinicas` | Administrador |
| `PUT` | `/api/clinicas/:id` | Administrador |
| `DELETE` | `/api/clinicas/:id` | Administrador |

### Almacenes, medicamentos e inventario

| Método | Ruta | Acceso |
|---|---|---|
| `GET` | `/api/almacenes` · `/api/medicamentos` · `/api/inventario` | Autenticado |
| `GET` | `/api/almacenes/:id` · `/api/medicamentos/:id` · `/api/inventario/:id` | Autenticado |
| `POST` | `/api/almacenes` · `/api/medicamentos` · `/api/inventario` | Administrador |
| `PUT` | `/api/almacenes/:id` · `/api/medicamentos/:id` · `/api/inventario/:id` | Administrador |
| `DELETE` | `/api/almacenes/:id` · `/api/medicamentos/:id` · `/api/inventario/:id` | Administrador |

### Solicitudes

| Método | Ruta | Acceso |
|---|---|---|
| `GET` | `/api/solicitudes` | Autenticado |
| `GET` | `/api/solicitudes/historial` | Autenticado |
| `GET` | `/api/solicitudes/:id` | Autenticado |
| `POST` | `/api/solicitudes` | Gestor y administrador |
| `PATCH` | `/api/solicitudes/:id/estado` | Gestor y administrador |
| `PUT` | `/api/solicitudes/:id` | Administrador |
| `DELETE` | `/api/solicitudes/:id` | Administrador |

---

## Reglas de negocio

### Estados de una solicitud

```
pendiente ──> aprobada ──> entregada   (final)
    │             └──────> cancelada   (final)
    ├──────> rechazada                 (final)
    └──────> cancelada                 (final)
```

Cualquier otro salto se rechaza con un `400` que indica el estado actual y a cuáles sí se puede pasar.

### Manejo del inventario

- Al **crear** una solicitud se revisa que haya existencias suficientes, pero **no se descuenta** nada todavía.
- Al pasar la solicitud a **aprobada** se descuentan las unidades del almacén.
- Al **cancelar** una solicitud que estaba aprobada, las unidades se devuelven.
- Al **eliminar lógicamente** una solicitud aprobada, las unidades también se devuelven.

Todo esto ocurre dentro de una transacción de Sequelize que bloquea la fila del inventario, para que dos aprobaciones simultáneas no descuenten las mismas unidades.

### Validaciones

| Regla | Respuesta |
|---|---|
| Cantidad solicitada menor o igual a cero | `400` |
| Dos clínicas con el mismo NIT | `409` |
| Clínica, medicamento o almacén inexistente | `404` indicando cuál |
| El almacén no maneja ese medicamento | `400` |
| Inventario insuficiente | `400` con lo pedido y lo disponible |
| Cambio de estado no permitido | `400` con los estados válidos |
| Usuario sin el rol necesario | `403` |
| Sin token, o token inválido o vencido | `401` |

### Eliminación lógica

Ninguna entidad se borra de la base de datos. El `DELETE` pone el campo `is_active` en `false`, de modo que el registro desaparece de los listados pero sigue existiendo y el historial de solicitudes que lo referencia se conserva intacto.

---

## Estructura del proyecto

```
src/
├── app.ts                  Punto de entrada: monta los middlewares y las rutas
├── config/
│   ├── db.ts               Conexión con PostgreSQL
│   ├── migrator.ts         Configuración de Umzug para las migraciones
│   ├── seeders.ts          Configuración de Umzug para los seeders
│   ├── migrate-*.ts        Comandos de migración
│   ├── seeders-*.ts        Comandos de seeders
│   └── swagger.ts          Configuración de la documentación
├── migrations/             Creación de las tablas, en orden numérico
├── seeders/                Datos de prueba, en el mismo orden
├── models/                 Modelos de Sequelize y sus asociaciones
├── dto/                    Esquemas de validación con Zod
├── middlewares/            Autenticación, roles y reglas de negocio
├── services/               Lógica de negocio
├── controllers/            Traducción entre HTTP y los services
├── routes/                 Definición de rutas y documentación Swagger
├── types/                  Tipos e interfaces propias
└── utils/                  Utilidades: errores HTTP y estados de solicitud
```

El flujo de una petición es siempre el mismo:

```
ruta → middlewares de validación → controlador → service → modelo → base de datos
```

Los controladores solo se ocupan de lo relacionado con HTTP: leer la petición, elegir el código de estado y responder. Toda la lógica de negocio vive en los *services*.

---

## Base de datos

El archivo `backup.sql` en la raíz del repositorio contiene un respaldo completo de la base de datos, con su estructura y los datos de prueba ya cargados.

Para restaurarlo:

```bash
createdb -h localhost -U admin db_nodejs
psql -h localhost -U admin -d db_nodejs -f backup.sql
```
