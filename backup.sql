--
-- PostgreSQL database dump
--

\restrict r9rPrYdZE4S1aPkHKmLwfcOrEwFX5jZmaDzFgzocIBbILj6POfkh7FuBAVwMmm9

-- Dumped from database version 16.15 (Debian 16.15-1.pgdg13+2)
-- Dumped by pg_dump version 16.15 (Debian 16.15-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: enum_requests_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_requests_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'delivered',
    'cancelled'
);


--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_role AS ENUM (
    'admin',
    'manager'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeData; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SequelizeData" (
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: clinics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clinics (
    id uuid NOT NULL,
    name character varying(150) NOT NULL,
    tax_id character varying(20) NOT NULL,
    address character varying(200) NOT NULL,
    phone character varying(20) NOT NULL,
    email character varying(150) NOT NULL,
    manager_name character varying(150) NOT NULL,
    manager_email character varying(150) NOT NULL,
    manager_phone character varying(20) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventory (
    id uuid NOT NULL,
    warehouse_id uuid NOT NULL,
    medication_id uuid NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT inventory_quantity_not_negative CHECK ((quantity >= 0))
);


--
-- Name: medications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medications (
    id uuid NOT NULL,
    name character varying(150) NOT NULL,
    description character varying(255) NOT NULL,
    presentation character varying(100) NOT NULL,
    laboratory character varying(150) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.requests (
    id uuid NOT NULL,
    clinic_id uuid NOT NULL,
    medication_id uuid NOT NULL,
    warehouse_id uuid NOT NULL,
    user_id uuid NOT NULL,
    requested_quantity integer NOT NULL,
    status public.enum_requests_status DEFAULT 'pending'::public.enum_requests_status NOT NULL,
    notes text,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT requests_quantity_greater_than_zero CHECK ((requested_quantity > 0))
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role public.enum_users_role NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.warehouses (
    id uuid NOT NULL,
    name character varying(150) NOT NULL,
    address character varying(200) NOT NULL,
    phone character varying(20) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Data for Name: SequelizeData; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SequelizeData" (name, "createdAt", "updatedAt") FROM stdin;
010-users.seed.ts	2026-09-02 16:56:24.199+00	2026-09-02 16:56:24.199+00
020-clinics.seed.ts	2026-09-02 16:56:24.212+00	2026-09-02 16:56:24.212+00
030-warehouses.seed.ts	2026-09-02 16:56:24.224+00	2026-09-02 16:56:24.224+00
040-medications.seed.ts	2026-09-02 16:56:24.238+00	2026-09-02 16:56:24.238+00
050-inventory.seed.ts	2026-09-02 16:56:24.254+00	2026-09-02 16:56:24.254+00
060-requests.seed.ts	2026-09-02 16:56:24.273+00	2026-09-02 16:56:24.273+00
\.


--
-- Data for Name: clinics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.clinics (id, name, tax_id, address, phone, email, manager_name, manager_email, manager_phone, is_active, "createdAt", "updatedAt") FROM stdin;
b2ec21c9-657c-4073-b8f8-1cc8c1c99f2b	Clínica Las Américas	890900123-1	Diagonal 75B No 2A-80, Medellín	6043421010	contacto@lasamericas.com	Ana Gómez Ruiz	ana.gomez@lasamericas.com	3001112233	t	2026-09-02 16:56:24.207+00	2026-09-02 16:56:24.207+00
d74c9ba8-36f8-4989-84d4-03f39a3925c4	Hospital San Vicente	890905166-2	Calle 64 No 51D-154, Medellín	6044441234	contacto@sanvicente.com	Carlos Mejía Ospina	carlos.mejia@sanvicente.com	3014445566	t	2026-09-02 16:56:24.207+00	2026-09-02 16:56:24.207+00
97c4c31c-e216-4f4a-9b9e-f967f195f74d	Centro Médico El Poblado	901234567-3	Carrera 43A No 5-15, Medellín	6045556677	contacto@cmpoblado.com	Diana Torres Vélez	diana.torres@cmpoblado.com	3027778899	t	2026-09-02 16:56:24.207+00	2026-09-02 16:56:24.207+00
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventory (id, warehouse_id, medication_id, quantity, is_active, "createdAt", "updatedAt") FROM stdin;
1cb4f5d4-1e55-433d-9ec3-16e9714deef7	971c4213-8627-40d0-a5ad-4a689f63c99f	da82a211-358f-477e-b243-00e1ea6624f7	500	t	2026-09-02 16:56:24.249+00	2026-09-02 16:56:24.249+00
20826544-6649-42b1-8418-871013ef1379	971c4213-8627-40d0-a5ad-4a689f63c99f	e25b2716-5a06-4ae8-a639-f495db52dcb9	150	t	2026-09-02 16:56:24.249+00	2026-09-02 16:56:24.249+00
05410323-9c7a-408d-b9dc-d1f4a7e91f3e	971c4213-8627-40d0-a5ad-4a689f63c99f	18679b0f-0849-42b2-911c-52c4bb380fcb	80	t	2026-09-02 16:56:24.249+00	2026-09-02 16:56:24.249+00
97634cc4-48e0-4b3e-99ea-e644b91acc0b	971c4213-8627-40d0-a5ad-4a689f63c99f	466a6f08-fac1-400d-80a8-2c4844992d3a	120	t	2026-09-02 16:56:24.249+00	2026-09-02 16:56:24.249+00
aac336b5-7388-4121-a22d-a013a1c64fd5	d1786c4f-6467-47e8-8fbf-3aad2a85f921	da82a211-358f-477e-b243-00e1ea6624f7	250	t	2026-09-02 16:56:24.249+00	2026-09-02 16:56:24.249+00
6d7d3d39-47c2-4441-bc53-64a97368f57c	d1786c4f-6467-47e8-8fbf-3aad2a85f921	fa51be2e-f970-4a9b-a93e-e13e12cbff98	40	t	2026-09-02 16:56:24.249+00	2026-09-02 16:56:24.249+00
9d02a812-2e4f-49d3-9b3c-b5e4d9e49335	d1786c4f-6467-47e8-8fbf-3aad2a85f921	e25b2716-5a06-4ae8-a639-f495db52dcb9	60	t	2026-09-02 16:56:24.249+00	2026-09-02 16:56:24.249+00
c8016f4d-aad8-47f1-916d-dcf5a6aeda38	971c4213-8627-40d0-a5ad-4a689f63c99f	fa51be2e-f970-4a9b-a93e-e13e12cbff98	250	t	2026-09-02 16:56:24.249+00	2026-09-02 16:56:24.265061+00
6a2f094f-9671-458b-8083-97aec420491f	971c4213-8627-40d0-a5ad-4a689f63c99f	3f6894f4-ce27-456d-9eda-a85db3b323cd	170	t	2026-09-02 16:56:24.249+00	2026-09-02 16:56:24.267292+00
\.


--
-- Data for Name: medications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.medications (id, name, description, presentation, laboratory, is_active, "createdAt", "updatedAt") FROM stdin;
da82a211-358f-477e-b243-00e1ea6624f7	Acetaminofén 500mg	Analgésico y antipirético de uso general.	Caja x 30 tabletas	Genfar	t	2026-09-02 16:56:24.232+00	2026-09-02 16:56:24.232+00
fa51be2e-f970-4a9b-a93e-e13e12cbff98	Ibuprofeno 400mg	Antiinflamatorio no esteroideo.	Caja x 20 tabletas	MK	t	2026-09-02 16:56:24.232+00	2026-09-02 16:56:24.232+00
3f6894f4-ce27-456d-9eda-a85db3b323cd	Amoxicilina 500mg	Antibiótico de amplio espectro.	Caja x 15 cápsulas	La Santé	t	2026-09-02 16:56:24.232+00	2026-09-02 16:56:24.232+00
e25b2716-5a06-4ae8-a639-f495db52dcb9	Solución salina 0.9%	Solución para hidratación y limpieza de heridas.	Bolsa 500 ml	Baxter	t	2026-09-02 16:56:24.232+00	2026-09-02 16:56:24.232+00
18679b0f-0849-42b2-911c-52c4bb380fcb	Jeringa desechable 5ml	Insumo médico estéril de un solo uso.	Paquete x 100 unidades	BD	t	2026-09-02 16:56:24.232+00	2026-09-02 16:56:24.232+00
466a6f08-fac1-400d-80a8-2c4844992d3a	Losartán 50mg	Antihipertensivo para el control de la presión arterial.	Caja x 30 tabletas	Tecnoquímicas	t	2026-09-02 16:56:24.232+00	2026-09-02 16:56:24.232+00
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migrations (name, "createdAt", "updatedAt") FROM stdin;
010-users.migration.ts	2026-09-02 16:56:12.292+00	2026-09-02 16:56:12.292+00
020-clinics.migration.ts	2026-09-02 16:56:12.319+00	2026-09-02 16:56:12.319+00
030-warehouses.migration.ts	2026-09-02 16:56:12.348+00	2026-09-02 16:56:12.348+00
040-medications.migration.ts	2026-09-02 16:56:12.367+00	2026-09-02 16:56:12.367+00
050-inventory.migration.ts	2026-09-02 16:56:12.394+00	2026-09-02 16:56:12.394+00
060-requests.migration.ts	2026-09-02 16:56:12.461+00	2026-09-02 16:56:12.461+00
\.


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.requests (id, clinic_id, medication_id, warehouse_id, user_id, requested_quantity, status, notes, is_active, "createdAt", "updatedAt") FROM stdin;
1f9bfdb2-18f7-43d5-9111-622ca00b67ce	b2ec21c9-657c-4073-b8f8-1cc8c1c99f2b	da82a211-358f-477e-b243-00e1ea6624f7	971c4213-8627-40d0-a5ad-4a689f63c99f	4791f966-924c-4316-bded-2be6696fbaae	100	pending	Pedido mensual de analgésicos.	t	2026-09-02 16:56:24.264+00	2026-09-02 16:56:24.264+00
db4e4a6b-94a4-46ae-b80f-b927f9d7e5a6	d74c9ba8-36f8-4989-84d4-03f39a3925c4	18679b0f-0849-42b2-911c-52c4bb380fcb	971c4213-8627-40d0-a5ad-4a689f63c99f	d1010cb8-c033-4d1e-827b-eb862f63b84d	20	pending	Reposición de insumos de enfermería.	t	2026-09-02 16:56:24.264+00	2026-09-02 16:56:24.264+00
b92ed51f-8d13-4dc0-bcfb-729a6b96a993	97c4c31c-e216-4f4a-9b9e-f967f195f74d	fa51be2e-f970-4a9b-a93e-e13e12cbff98	971c4213-8627-40d0-a5ad-4a689f63c99f	4791f966-924c-4316-bded-2be6696fbaae	50	approved	Aprobada por el administrador.	t	2026-09-02 16:56:24.264+00	2026-09-02 16:56:24.264+00
4e13ea67-e79c-4e03-aac6-1b6bfb1fbfc3	b2ec21c9-657c-4073-b8f8-1cc8c1c99f2b	3f6894f4-ce27-456d-9eda-a85db3b323cd	971c4213-8627-40d0-a5ad-4a689f63c99f	d1010cb8-c033-4d1e-827b-eb862f63b84d	30	delivered	Entregada el mes pasado.	t	2026-09-02 16:56:24.264+00	2026-09-02 16:56:24.264+00
86992814-8aeb-45db-b037-561cb071590d	d74c9ba8-36f8-4989-84d4-03f39a3925c4	466a6f08-fac1-400d-80a8-2c4844992d3a	971c4213-8627-40d0-a5ad-4a689f63c99f	4791f966-924c-4316-bded-2be6696fbaae	400	rejected	Rechazada por exceder el consumo habitual.	t	2026-09-02 16:56:24.264+00	2026-09-02 16:56:24.264+00
9f50159a-24b9-4435-b93b-8ddaeb1f2bb7	97c4c31c-e216-4f4a-9b9e-f967f195f74d	e25b2716-5a06-4ae8-a639-f495db52dcb9	d1786c4f-6467-47e8-8fbf-3aad2a85f921	d1010cb8-c033-4d1e-827b-eb862f63b84d	25	cancelled	La clínica anuló el pedido.	t	2026-09-02 16:56:24.264+00	2026-09-02 16:56:24.264+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, first_name, last_name, email, password_hash, role, is_active, "createdAt", "updatedAt") FROM stdin;
28565702-9c6b-4a62-b455-8aec41c02825	dylan alberto	suárez laverde	dylan.suarez@riwimedicare.com	$2b$10$lcy5pSz3alRS76A9OJZC9u3yYfiS/h5EPGvy3meF9Cacb2aTxVWgC	admin	t	2026-09-02 16:56:24.191+00	2026-09-02 16:56:24.191+00
d0e2c39d-973f-42a6-9c1a-5cd219c50e73	camilo	del valle	camilo.delvalle@riwimedicare.com	$2b$10$lcy5pSz3alRS76A9OJZC9u3yYfiS/h5EPGvy3meF9Cacb2aTxVWgC	admin	t	2026-09-02 16:56:24.191+00	2026-09-02 16:56:24.191+00
4791f966-924c-4316-bded-2be6696fbaae	abrahan	villa	abrahan.villa@riwimedicare.com	$2b$10$bH4VqWKrSH6dxzdndL5BEO.G503uNfvw3HxKZcBvT51K3zrPO.wOC	manager	t	2026-09-02 16:56:24.191+00	2026-09-02 16:56:24.191+00
d1010cb8-c033-4d1e-827b-eb862f63b84d	laura	restrepo	laura.restrepo@riwimedicare.com	$2b$10$bH4VqWKrSH6dxzdndL5BEO.G503uNfvw3HxKZcBvT51K3zrPO.wOC	manager	t	2026-09-02 16:56:24.191+00	2026-09-02 16:56:24.191+00
\.


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.warehouses (id, name, address, phone, is_active, "createdAt", "updatedAt") FROM stdin;
971c4213-8627-40d0-a5ad-4a689f63c99f	Almacén Central Medellín	Carrera 50 No 20-30, Medellín	6044441111	t	2026-09-02 16:56:24.22+00	2026-09-02 16:56:24.22+00
d1786c4f-6467-47e8-8fbf-3aad2a85f921	Almacén Norte Bello	Calle 45 No 38-245, Bello	6044552222	t	2026-09-02 16:56:24.22+00	2026-09-02 16:56:24.22+00
\.


--
-- Name: SequelizeData SequelizeData_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SequelizeData"
    ADD CONSTRAINT "SequelizeData_pkey" PRIMARY KEY (name);


--
-- Name: clinics clinics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_pkey PRIMARY KEY (id);


--
-- Name: clinics clinics_tax_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinics
    ADD CONSTRAINT clinics_tax_id_key UNIQUE (tax_id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_warehouse_medication_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_warehouse_medication_unique UNIQUE (warehouse_id, medication_id);


--
-- Name: medications medications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medications
    ADD CONSTRAINT medications_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (name);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_medication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medications(id);


--
-- Name: inventory inventory_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: requests requests_clinic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_clinic_id_fkey FOREIGN KEY (clinic_id) REFERENCES public.clinics(id);


--
-- Name: requests requests_medication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medications(id);


--
-- Name: requests requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: requests requests_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- PostgreSQL database dump complete
--

\unrestrict r9rPrYdZE4S1aPkHKmLwfcOrEwFX5jZmaDzFgzocIBbILj6POfkh7FuBAVwMmm9

