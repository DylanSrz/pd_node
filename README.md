# RiwiMediCare Plus API

REST API to manage the life cycle of the supply requests of medications and medical supplies of the company **RiwiMediCare Plus**.

It allows registering clinics and their managers, administering the medication inventory of each warehouse, creating supply requests, assigning them to a warehouse, controlling their status and querying the request history of each clinic.

---

## Project details

| | |
|---|---|
| **Coder** | Dylan Alberto Suárez Laverde |
| **Clan** | centurion |
| **Test** | Performance test – Node.js |
| **Repository** | https://github.com/DylanSrz/pd_node |

---

## Technologies used

| Technology | Purpose |
|---|---|
| **Node.js 18+** | Runtime environment |
| **TypeScript** | Static typing across the whole project |
| **Express 5** | HTTP server framework |
| **PostgreSQL 16** | Relational database |
| **Sequelize 6** | ORM used to talk to the database |
| **Umzug** | Runs the migrations and the seeders by command |
| **JSON Web Token** | Authentication and route protection |
| **bcrypt** | Password hashing |
| **Zod** | Validation of the data coming into the API |
| **Swagger (swagger-jsdoc + swagger-ui-express)** | Endpoint documentation |
| **Docker and Docker Compose** | Running the API and the database in containers |
| **tsx** | Running TypeScript in development with hot reload |

---

## Installation

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 16 (or Docker, if the container option is preferred)
- Git

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/DylanSrz/pd_node.git
cd pd_node

# 2. Install the dependencies
npm install

# 3. Create the environment variables file
cp .env.example .env
#    Edit the .env with your own database details

# 4. Create the tables
npm run migrate

# 5. Load the test data
npm run seed

# 6. Start the server
npm run dev
```

The API becomes available at `http://localhost:3000` and the documentation at `http://localhost:3000/api-docs`.

---

## Environment variables

The `.env` file is not pushed to the repository. It is created from `.env.example`:

```env
# Port the API is served on
PORT=3000

# PostgreSQL connection details
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=admin
DATABASE_PASSWORD=admin1234
DATABASE_NAME=db_nodejs

# Secret key used to sign the JSON Web Token
JWT_SECRET=a3sd21m16uio87ft62mp4i0ok6j8b24sdfc6sd

# Token lifetime (examples: 1h, 8h, 7d)
JWT_EXPIRES_IN=8h
```

---

## Running the project

### Development mode

Starts the server and reloads it on its own every time a file is saved:

```bash
npm run dev
```

### Production mode

Compiles the TypeScript into JavaScript inside the `dist` folder and runs the result:

```bash
npm run build
npm start
```

### With Docker

Starts two containers: the API and PostgreSQL, connected through an internal network and with a volume so the data survives a shutdown.

```bash
# Start everything
docker compose up -d

# Watch the API logs
docker compose logs -f api

# Create the tables and load the data inside the container
docker compose exec api npm run migrate
docker compose exec api npm run seed

# Shut everything down
docker compose down
```

---

## Migrations and seeders

The tables are **not** created with `sequelize.sync()`, but with versioned migrations that are run by command. The seeders work the same way and load the test data.

| Command | What it does |
|---|---|
| `npm run migrate` | Creates every missing table |
| `npm run migrate:reverse` | Undoes the last migration |
| `npm run migrate:reset` | Undoes every migration |
| `npm run seed` | Loads all the test data |
| `npm run seed:down` | Undoes the last seeder |
| `npm run seed:reset` | Undoes every seeder |

### How to run the seeders

```bash
# 1. The tables first
npm run migrate

# 2. The data afterwards
npm run seed
```

Expected output:

```
{ event: 'migrating', name: '010-users.seed.ts' }
{ event: 'migrated',  name: '010-users.seed.ts' }
...
Seeders executed successfully
```

The seeders run **in numeric order**, because each one depends on the previous: the inventory needs the warehouses and the medications to already exist, and the requests need the clinics, the users and the inventory to exist.

Since the identifiers are UUIDs generated at random on every run, the seeders do not write them by hand: they query the previous tables and look the records up by their name (or by their email, in the case of the users).

### Data that is loaded

| Table | Records |
|---|---|
| `users` | 4 (2 admins and 2 managers) |
| `clinics` | 3 |
| `warehouses` | 2 |
| `medications` | 6 |
| `inventory` | 9 |
| `requests` | 6 (one for each status) |

To revert everything and start from scratch:

```bash
npm run seed:reset      # 1. cleans the seeder log
npm run migrate:reset   # 2. drops the tables
npm run migrate         # 3. creates them again
npm run seed            # 4. loads the data once more
```

> **The order matters.** `migrate:reset` drops the domain tables, but the
> log Umzug keeps of the seeders survives in the `SequelizeData` table.
> If `seed:reset` is not run first, `npm run seed` believes the seeders already
> ran, does not load anything again and the tables end up empty.

### Test users

| Email | Password | Role |
|---|---|---|
| dylan.suarez@riwimedicare.com | `admin1234` | admin |
| camilo.delvalle@riwimedicare.com | `admin1234` | admin |
| abrahan.villa@riwimedicare.com | `gestor1234` | manager |
| laura.restrepo@riwimedicare.com | `gestor1234` | manager |

---

## API documentation

With the server up, the interactive documentation lives at:

**http://localhost:3000/api-docs**

To try the protected endpoints:

1. Run `POST /api/auth/login` with one of the test users.
2. Copy the `token` value from the response.
3. Press the **Authorize** button and paste the token (without typing the word `Bearer`).
4. Every other endpoint can now be executed.

---

## Endpoints

Every route requires a token, **except sign up and sign in**.

### Authentication

| Method | Route | Access |
|---|---|---|
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |

### Clinics

| Method | Route | Access |
|---|---|---|
| `GET` | `/api/clinics` | Authenticated |
| `GET` | `/api/clinics/:id` | Authenticated |
| `GET` | `/api/clinics/:id/requests` | Authenticated |
| `POST` | `/api/clinics` | Admin |
| `PUT` | `/api/clinics/:id` | Admin |
| `DELETE` | `/api/clinics/:id` | Admin |

### Warehouses, medications and inventory

| Method | Route | Access |
|---|---|---|
| `GET` | `/api/warehouses` · `/api/medications` · `/api/inventory` | Authenticated |
| `GET` | `/api/warehouses/:id` · `/api/medications/:id` · `/api/inventory/:id` | Authenticated |
| `POST` | `/api/warehouses` · `/api/medications` · `/api/inventory` | Admin |
| `PUT` | `/api/warehouses/:id` · `/api/medications/:id` · `/api/inventory/:id` | Admin |
| `DELETE` | `/api/warehouses/:id` · `/api/medications/:id` · `/api/inventory/:id` | Admin |

### Requests

| Method | Route | Access |
|---|---|---|
| `GET` | `/api/requests` | Authenticated |
| `GET` | `/api/requests/history` | Authenticated |
| `GET` | `/api/requests/:id` | Authenticated |
| `POST` | `/api/requests` | Manager and admin |
| `PATCH` | `/api/requests/:id/status` | Manager and admin |
| `PUT` | `/api/requests/:id` | Admin |
| `DELETE` | `/api/requests/:id` | Admin |

---

## Business rules

### Statuses of a request

```
pending ──> approved ──> delivered   (final)
   │            └──────> cancelled   (final)
   ├─────> rejected                  (final)
   └─────> cancelled                 (final)
```

Any other jump is rejected with a `400` that states the current status and which ones it can actually move to.

### Inventory handling

- When **creating** a request it is checked that there is enough stock, but **nothing is discounted** yet.
- When moving the request to **approved** the units are discounted from the warehouse.
- When **cancelling** a request that was approved, the units are given back.
- When **logically deleting** an approved request, the units are given back too.

All of this happens inside a Sequelize transaction that locks the inventory row, so that two simultaneous approvals do not discount the same units.

### Validations

| Rule | Response |
|---|---|
| Requested quantity lower than or equal to zero | `400` |
| Two clinics with the same tax id | `409` |
| Non-existent clinic, medication or warehouse | `404` stating which one |
| The warehouse does not handle that medication | `400` |
| Not enough inventory | `400` with what was requested and what is available |
| Status change not allowed | `400` with the valid statuses |
| User without the required role | `403` |
| No token, or invalid or expired token | `401` |

### Logical deletion

No entity is removed from the database. The `DELETE` sets the `is_active` field to `false`, so the record disappears from the listings but keeps existing and the request history that references it is preserved intact.

---

## Project structure

```
src/
├── app.ts                  Entry point: mounts the middlewares and the routes
├── config/
│   ├── db.ts               PostgreSQL connection
│   ├── migrator.ts         Umzug configuration for the migrations
│   ├── seeders.ts          Umzug configuration for the seeders
│   ├── migrate-*.ts        Migration commands
│   ├── seeders-*.ts        Seeder commands
│   └── swagger.ts          Documentation configuration
├── migrations/             Table creation, in numeric order
├── seeders/                Test data, in the same order
├── models/                 Sequelize models and their associations
├── dto/                    Validation schemas with Zod
├── middlewares/            Authentication, roles and business rules
├── services/               Business logic
├── controllers/            Translation between HTTP and the services
├── routes/                 Route definition and Swagger documentation
├── types/                  Own types and interfaces
└── utils/                  Utilities: HTTP errors and request statuses
```

The flow of a request is always the same:

```
route → validation middlewares → controller → service → model → database
```

The controllers only deal with what is related to HTTP: reading the request, choosing the status code and answering. All the business logic lives in the *services*.

---

## Database

The `backup.sql` file at the root of the repository contains a full backup of the database, with its structure and the test data already loaded.

To restore it:

```bash
createdb -h localhost -U admin db_nodejs
psql -h localhost -U admin -d db_nodejs -f backup.sql
```
