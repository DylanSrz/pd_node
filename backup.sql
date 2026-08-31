--
-- PostgreSQL database dump
--

\restrict Ryk1clzKhzNLBS41IJDRkHukGelCFZtc3haPceQF7kk3Z35KysDpZdnMlv4X1iL

-- Dumped from database version 16.15 (Debian 16.15-1.pgdg13+2)
-- Dumped by pg_dump version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)

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
-- Name: enum_solicitudes_estado; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_solicitudes_estado AS ENUM (
    'pendiente',
    'aprobada',
    'rechazada',
    'entregada',
    'cancelada'
);


--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_role AS ENUM (
    'administrador',
    'gestor'
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
-- Name: almacenes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.almacenes (
    id uuid NOT NULL,
    nombre character varying(150) NOT NULL,
    direccion character varying(200) NOT NULL,
    telefono character varying(20) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: clinicas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clinicas (
    id uuid NOT NULL,
    nombre character varying(150) NOT NULL,
    nit character varying(20) NOT NULL,
    direccion character varying(200) NOT NULL,
    telefono character varying(20) NOT NULL,
    email character varying(150) NOT NULL,
    responsable_nombre character varying(150) NOT NULL,
    responsable_email character varying(150) NOT NULL,
    responsable_telefono character varying(20) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: inventario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventario (
    id uuid NOT NULL,
    almacen_id uuid NOT NULL,
    medicamento_id uuid NOT NULL,
    cantidad integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT inventario_cantidad_no_negativa CHECK ((cantidad >= 0))
);


--
-- Name: medicamentos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medicamentos (
    id uuid NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion character varying(255) NOT NULL,
    presentacion character varying(100) NOT NULL,
    laboratorio character varying(150) NOT NULL,
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
-- Name: solicitudes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solicitudes (
    id uuid NOT NULL,
    clinica_id uuid NOT NULL,
    medicamento_id uuid NOT NULL,
    almacen_id uuid NOT NULL,
    usuario_id uuid NOT NULL,
    cantidad_solicitada integer NOT NULL,
    estado public.enum_solicitudes_estado DEFAULT 'pendiente'::public.enum_solicitudes_estado NOT NULL,
    observaciones text,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT solicitudes_cantidad_mayor_a_cero CHECK ((cantidad_solicitada > 0))
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
-- Data for Name: SequelizeData; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SequelizeData" (name, "createdAt", "updatedAt") FROM stdin;
010-users.seed.ts	2026-08-31 22:31:16.744+00	2026-08-31 22:31:16.744+00
020-clinicas.seed.ts	2026-08-31 22:31:16.753+00	2026-08-31 22:31:16.753+00
030-almacenes.seed.ts	2026-08-31 22:31:16.76+00	2026-08-31 22:31:16.76+00
040-medicamentos.seed.ts	2026-08-31 22:31:16.766+00	2026-08-31 22:31:16.766+00
050-inventario.seed.ts	2026-08-31 22:31:16.774+00	2026-08-31 22:31:16.774+00
060-solicitudes.seed.ts	2026-08-31 22:31:16.784+00	2026-08-31 22:31:16.784+00
\.


--
-- Data for Name: almacenes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.almacenes (id, nombre, direccion, telefono, is_active, "createdAt", "updatedAt") FROM stdin;
4684f66a-2ce1-4464-98b5-ad7fc6b10390	Almacén Central Medellín	Carrera 50 No 20-30, Medellín	6044441111	t	2026-08-31 22:31:16.756+00	2026-08-31 22:31:16.756+00
6372c01f-0db1-45e3-a8e1-5486a2c98d1a	Almacén Norte Bello	Calle 45 No 38-245, Bello	6044552222	t	2026-08-31 22:31:16.756+00	2026-08-31 22:31:16.756+00
\.


--
-- Data for Name: clinicas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.clinicas (id, nombre, nit, direccion, telefono, email, responsable_nombre, responsable_email, responsable_telefono, is_active, "createdAt", "updatedAt") FROM stdin;
3ef75011-7e8c-4910-b876-cd6da18b1381	Clínica Las Américas	890900123-1	Diagonal 75B No 2A-80, Medellín	6043421010	contacto@lasamericas.com	Ana Gómez Ruiz	ana.gomez@lasamericas.com	3001112233	t	2026-08-31 22:31:16.749+00	2026-08-31 22:31:16.749+00
e9cbc5a0-fceb-43fd-8270-bdc2bebafae9	Hospital San Vicente	890905166-2	Calle 64 No 51D-154, Medellín	6044441234	contacto@sanvicente.com	Carlos Mejía Ospina	carlos.mejia@sanvicente.com	3014445566	t	2026-08-31 22:31:16.749+00	2026-08-31 22:31:16.749+00
0760a125-5ed8-4817-aaa0-03950326e7a7	Centro Médico El Poblado	901234567-3	Carrera 43A No 5-15, Medellín	6045556677	contacto@cmpoblado.com	Diana Torres Vélez	diana.torres@cmpoblado.com	3027778899	t	2026-08-31 22:31:16.749+00	2026-08-31 22:31:16.749+00
\.


--
-- Data for Name: inventario; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventario (id, almacen_id, medicamento_id, cantidad, is_active, "createdAt", "updatedAt") FROM stdin;
8e78b672-ba29-4533-961a-75d1c2d8838b	4684f66a-2ce1-4464-98b5-ad7fc6b10390	013bf445-2a5a-409f-a5b1-d2759ae473a8	500	t	2026-08-31 22:31:16.77+00	2026-08-31 22:31:16.77+00
2b7695f0-e477-4177-bdcc-82875e09d98c	4684f66a-2ce1-4464-98b5-ad7fc6b10390	ecb290c7-608d-4ce1-98ac-bff32c12a6b8	150	t	2026-08-31 22:31:16.77+00	2026-08-31 22:31:16.77+00
37042622-4bfb-4df2-855f-d977d1b971ef	4684f66a-2ce1-4464-98b5-ad7fc6b10390	eab0a348-03c5-4dc4-8bca-d7c917e61dd8	80	t	2026-08-31 22:31:16.77+00	2026-08-31 22:31:16.77+00
dbcba38e-c25f-4f0b-9189-53ddd8175fa4	4684f66a-2ce1-4464-98b5-ad7fc6b10390	e2c2ca9b-4558-478c-b730-c6a955d2f65c	120	t	2026-08-31 22:31:16.77+00	2026-08-31 22:31:16.77+00
c8ed866a-6d63-44f5-a7ff-b861d40a39b9	6372c01f-0db1-45e3-a8e1-5486a2c98d1a	013bf445-2a5a-409f-a5b1-d2759ae473a8	250	t	2026-08-31 22:31:16.77+00	2026-08-31 22:31:16.77+00
0352a882-ed4f-41b2-9799-2e32269fc53e	6372c01f-0db1-45e3-a8e1-5486a2c98d1a	299552b7-380f-4f68-ac82-2a1ed32e551d	40	t	2026-08-31 22:31:16.77+00	2026-08-31 22:31:16.77+00
3459f162-b034-4dc9-85e2-1d6f76bdeebc	6372c01f-0db1-45e3-a8e1-5486a2c98d1a	ecb290c7-608d-4ce1-98ac-bff32c12a6b8	60	t	2026-08-31 22:31:16.77+00	2026-08-31 22:31:16.77+00
125e5c92-5104-4b66-950c-d0260a0e2ed9	4684f66a-2ce1-4464-98b5-ad7fc6b10390	299552b7-380f-4f68-ac82-2a1ed32e551d	250	t	2026-08-31 22:31:16.77+00	2026-08-31 22:31:16.779373+00
cc035748-5bda-483a-a113-5597db565ef0	4684f66a-2ce1-4464-98b5-ad7fc6b10390	1565617a-7c4a-48fc-8981-0496532edbcc	170	t	2026-08-31 22:31:16.77+00	2026-08-31 22:31:16.780308+00
\.


--
-- Data for Name: medicamentos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.medicamentos (id, nombre, descripcion, presentacion, laboratorio, is_active, "createdAt", "updatedAt") FROM stdin;
013bf445-2a5a-409f-a5b1-d2759ae473a8	Acetaminofén 500mg	Analgésico y antipirético de uso general.	Caja x 30 tabletas	Genfar	t	2026-08-31 22:31:16.763+00	2026-08-31 22:31:16.763+00
299552b7-380f-4f68-ac82-2a1ed32e551d	Ibuprofeno 400mg	Antiinflamatorio no esteroideo.	Caja x 20 tabletas	MK	t	2026-08-31 22:31:16.763+00	2026-08-31 22:31:16.763+00
1565617a-7c4a-48fc-8981-0496532edbcc	Amoxicilina 500mg	Antibiótico de amplio espectro.	Caja x 15 cápsulas	La Santé	t	2026-08-31 22:31:16.763+00	2026-08-31 22:31:16.763+00
ecb290c7-608d-4ce1-98ac-bff32c12a6b8	Solución salina 0.9%	Solución para hidratación y limpieza de heridas.	Bolsa 500 ml	Baxter	t	2026-08-31 22:31:16.763+00	2026-08-31 22:31:16.763+00
eab0a348-03c5-4dc4-8bca-d7c917e61dd8	Jeringa desechable 5ml	Insumo médico estéril de un solo uso.	Paquete x 100 unidades	BD	t	2026-08-31 22:31:16.763+00	2026-08-31 22:31:16.763+00
e2c2ca9b-4558-478c-b730-c6a955d2f65c	Losartán 50mg	Antihipertensivo para el control de la presión arterial.	Caja x 30 tabletas	Tecnoquímicas	t	2026-08-31 22:31:16.763+00	2026-08-31 22:31:16.763+00
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migrations (name, "createdAt", "updatedAt") FROM stdin;
010-users.migration.ts	2026-08-31 22:31:05.176+00	2026-08-31 22:31:05.176+00
020-clinicas.migration.ts	2026-08-31 22:31:05.189+00	2026-08-31 22:31:05.189+00
030-almacenes.migration.ts	2026-08-31 22:31:05.196+00	2026-08-31 22:31:05.196+00
040-medicamentos.migration.ts	2026-08-31 22:31:05.204+00	2026-08-31 22:31:05.204+00
050-inventario.migration.ts	2026-08-31 22:31:05.214+00	2026-08-31 22:31:05.214+00
060-solicitudes.migration.ts	2026-08-31 22:31:05.226+00	2026-08-31 22:31:05.226+00
\.


--
-- Data for Name: solicitudes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.solicitudes (id, clinica_id, medicamento_id, almacen_id, usuario_id, cantidad_solicitada, estado, observaciones, is_active, "createdAt", "updatedAt") FROM stdin;
8ebb8d92-14bd-407c-94bb-64cae580b7ca	3ef75011-7e8c-4910-b876-cd6da18b1381	013bf445-2a5a-409f-a5b1-d2759ae473a8	4684f66a-2ce1-4464-98b5-ad7fc6b10390	7a98c2f3-34b2-48aa-b99a-0354edc42f30	100	pendiente	Pedido mensual de analgésicos.	t	2026-08-31 22:31:16.778+00	2026-08-31 22:31:16.778+00
8c264af1-40b0-4f2e-a158-400f07678903	e9cbc5a0-fceb-43fd-8270-bdc2bebafae9	eab0a348-03c5-4dc4-8bca-d7c917e61dd8	4684f66a-2ce1-4464-98b5-ad7fc6b10390	f2765298-9a0d-4d19-bc4a-07b6de9f8346	20	pendiente	Reposición de insumos de enfermería.	t	2026-08-31 22:31:16.778+00	2026-08-31 22:31:16.778+00
8e83fee5-3277-401f-b99c-8766ee785111	0760a125-5ed8-4817-aaa0-03950326e7a7	299552b7-380f-4f68-ac82-2a1ed32e551d	4684f66a-2ce1-4464-98b5-ad7fc6b10390	7a98c2f3-34b2-48aa-b99a-0354edc42f30	50	aprobada	Aprobada por el administrador.	t	2026-08-31 22:31:16.778+00	2026-08-31 22:31:16.778+00
95075d98-78a5-41bb-aec4-798f3ccaba80	3ef75011-7e8c-4910-b876-cd6da18b1381	1565617a-7c4a-48fc-8981-0496532edbcc	4684f66a-2ce1-4464-98b5-ad7fc6b10390	f2765298-9a0d-4d19-bc4a-07b6de9f8346	30	entregada	Entregada el mes pasado.	t	2026-08-31 22:31:16.778+00	2026-08-31 22:31:16.778+00
3b5b0623-ed69-4d1a-a57f-8c0a855cf004	e9cbc5a0-fceb-43fd-8270-bdc2bebafae9	e2c2ca9b-4558-478c-b730-c6a955d2f65c	4684f66a-2ce1-4464-98b5-ad7fc6b10390	7a98c2f3-34b2-48aa-b99a-0354edc42f30	400	rechazada	Rechazada por exceder el consumo habitual.	t	2026-08-31 22:31:16.778+00	2026-08-31 22:31:16.778+00
0a41162a-7ee4-4cc4-9930-ef14f7bd96ed	0760a125-5ed8-4817-aaa0-03950326e7a7	ecb290c7-608d-4ce1-98ac-bff32c12a6b8	6372c01f-0db1-45e3-a8e1-5486a2c98d1a	f2765298-9a0d-4d19-bc4a-07b6de9f8346	25	cancelada	La clínica anuló el pedido.	t	2026-08-31 22:31:16.778+00	2026-08-31 22:31:16.778+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, first_name, last_name, email, password_hash, role, is_active, "createdAt", "updatedAt") FROM stdin;
ff980386-a0b1-4864-9f90-a5bbe8ecdcb7	dylan alberto	suárez laverde	dylan.suarez@riwimedicare.com	$2b$10$ptl5/jdbiis1hpL17SYXvetC0gLztR9xadCdd1cDr80O.2cYeJ47W	administrador	t	2026-08-31 22:31:16.736+00	2026-08-31 22:31:16.736+00
856eebe6-9c5a-4cc1-8e8e-adafd4789c82	camilo	del valle	camilo.delvalle@riwimedicare.com	$2b$10$ptl5/jdbiis1hpL17SYXvetC0gLztR9xadCdd1cDr80O.2cYeJ47W	administrador	t	2026-08-31 22:31:16.736+00	2026-08-31 22:31:16.736+00
7a98c2f3-34b2-48aa-b99a-0354edc42f30	abrahan	villa	abrahan.villa@riwimedicare.com	$2b$10$.uybdRQD0kdUss5q.2IsLuRXaQdvg3/.pSFZkU44uHW0D6EymCXXC	gestor	t	2026-08-31 22:31:16.736+00	2026-08-31 22:31:16.736+00
f2765298-9a0d-4d19-bc4a-07b6de9f8346	laura	restrepo	laura.restrepo@riwimedicare.com	$2b$10$.uybdRQD0kdUss5q.2IsLuRXaQdvg3/.pSFZkU44uHW0D6EymCXXC	gestor	t	2026-08-31 22:31:16.736+00	2026-08-31 22:31:16.736+00
\.


--
-- Name: SequelizeData SequelizeData_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SequelizeData"
    ADD CONSTRAINT "SequelizeData_pkey" PRIMARY KEY (name);


--
-- Name: almacenes almacenes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.almacenes
    ADD CONSTRAINT almacenes_pkey PRIMARY KEY (id);


--
-- Name: clinicas clinicas_nit_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinicas
    ADD CONSTRAINT clinicas_nit_key UNIQUE (nit);


--
-- Name: clinicas clinicas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clinicas
    ADD CONSTRAINT clinicas_pkey PRIMARY KEY (id);


--
-- Name: inventario inventario_almacen_medicamento_unico; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_almacen_medicamento_unico UNIQUE (almacen_id, medicamento_id);


--
-- Name: inventario inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_pkey PRIMARY KEY (id);


--
-- Name: medicamentos medicamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicamentos
    ADD CONSTRAINT medicamentos_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (name);


--
-- Name: solicitudes solicitudes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_pkey PRIMARY KEY (id);


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
-- Name: inventario inventario_almacen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_almacen_id_fkey FOREIGN KEY (almacen_id) REFERENCES public.almacenes(id);


--
-- Name: inventario inventario_medicamento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_medicamento_id_fkey FOREIGN KEY (medicamento_id) REFERENCES public.medicamentos(id);


--
-- Name: solicitudes solicitudes_almacen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_almacen_id_fkey FOREIGN KEY (almacen_id) REFERENCES public.almacenes(id);


--
-- Name: solicitudes solicitudes_clinica_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.clinicas(id);


--
-- Name: solicitudes solicitudes_medicamento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_medicamento_id_fkey FOREIGN KEY (medicamento_id) REFERENCES public.medicamentos(id);


--
-- Name: solicitudes solicitudes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict Ryk1clzKhzNLBS41IJDRkHukGelCFZtc3haPceQF7kk3Z35KysDpZdnMlv4X1iL

