# Guía de capturas de pantalla

**Evidencia:** Manual de Usuario — Norma 220501096
**Proyecto:** API RiwiMediCare Plus
**Aprendiz:** Dylan Alberto Suárez Laverde

---

## Cómo usar esta guía

El archivo `02-manual-de-usuario.html` tiene **31 espacios reservados** para capturas de pantalla, marcados con un recuadro verde punteado que dice `FIGURA N`.

Esta guía te dice, para cada una: **qué abrir, qué ejecutar, con qué datos exactos y cómo nombrar el archivo**.

### Procedimiento

1. Guarda cada captura en `sena/sena2/capturas/` con el nombre indicado.
2. Abre `02-manual-de-usuario.html` en un editor de texto.
3. Busca el bloque de la figura correspondiente:

```html
<div class="hueco-captura">
  <strong>FIGURA 1</strong>
  <em>Terminal mostrando las versiones instaladas...</em>
</div>
```

4. Reemplázalo por la imagen:

```html
<img src="capturas/01-versiones-instaladas.png" alt="Versiones instaladas">
```

5. **Deja el pie de figura** (la línea `<p style="text-align:center...">Figura 1. ...</p>` que va justo debajo). Ya está redactado.

> Si prefieres no editar el HTML, otra opción válida es imprimir el documento a PDF y luego insertar las imágenes en los espacios con un editor de PDF. El resultado es equivalente para la entrega.

### Recomendaciones para que las capturas se vean bien

- **Resolución:** mínimo 1280 px de ancho. Formato PNG.
- **Zoom del navegador:** ponlo en 100 % o 110 % para que el texto sea legible al imprimir.
- **Recorta lo innecesario:** en Swagger, captura solo el bloque del endpoint desplegado, no la página entera con los 30 endpoints colapsados.
- **Que se vea el código de respuesta:** en las capturas de Swagger, el número (200, 201, 400, 401, 403, 409) debe quedar visible. Es la evidencia real.
- **Windows:** usa `Win + Shift + S` (Recorte y anotación).
- **macOS:** usa `Cmd + Shift + 4`.

---

## Preparación previa

Antes de empezar, deja el entorno en un estado limpio y conocido:

```bash
npm run seed:reset
npm run migrate:reset
npm run migrate
npm run seed
npm run dev
```

Ten dos pestañas abiertas del navegador:
- `http://localhost:3000` — ruta raíz
- `http://localhost:3000/api-docs` — Swagger UI

---

## Bloque 1 · Requisitos e instalación (Figuras 1 a 8)

### FIGURA 1 — `01-versiones-instaladas.png`

**Dónde:** Terminal (PowerShell, CMD o bash).

**Qué ejecutar:**
```bash
node --version
npm --version
psql --version
git --version
docker --version
```

**Qué debe verse:** los cinco comandos con sus versiones, uno debajo del otro, en una sola captura.

---

### FIGURA 2 — `02-repositorio-clonado.png`

**Dónde:** Terminal.

**Qué ejecutar:**
```bash
git clone https://github.com/DylanSrz/pd_node.git
cd pd_node
ls
```

**Qué debe verse:** el mensaje de clonación completada y el listado de archivos del proyecto (`src`, `package.json`, `Dockerfile`, etc.).

> Si ya lo tienes clonado, basta con `cd pd_node` y `ls` mostrando el contenido.

---

### FIGURA 3 — `03-npm-install.png`

**Dónde:** Terminal, dentro de `pd_node`.

**Qué ejecutar:**
```bash
npm install
```

**Qué debe verse:** la línea final con el total de paquetes instalados y el tiempo (`added 342 packages in 47s` o similar).

---

### FIGURA 4 — `04-archivo-env.png`

**Dónde:** Visual Studio Code o cualquier editor.

**Qué abrir:** el archivo `.env` del proyecto.

**Qué debe verse:** las ocho variables configuradas.

> **Importante:** antes de capturar, cambia temporalmente `DATABASE_PASSWORD` y `JWT_SECRET` por valores de ejemplo, o difumina esa parte de la imagen. No conviene publicar credenciales reales en un documento que se entrega.

---

### FIGURA 5 — `05-npm-run-migrate.png`

**Dónde:** Terminal.

**Qué ejecutar:**
```bash
npm run migrate
```

**Qué debe verse:** las líneas `{ event: 'migrating', name: '010-users.migration.ts' }` … hasta `060-solicitudes.migration.ts`, y el mensaje final de éxito.

---

### FIGURA 6 — `06-npm-run-seed.png`

**Dónde:** Terminal.

**Qué ejecutar:**
```bash
npm run seed
```

**Qué debe verse:** los seis seeders ejecutados y la línea `Seeders executed successfully`.

---

### FIGURA 7 — `07-servidor-corriendo.png`

**Dónde:** Terminal.

**Qué ejecutar:**
```bash
npm run dev
```

**Qué debe verse:** las tres líneas de arranque:
```
Conexión con la base de datos establecida.
Servidor corriendo en el puerto: 3000
Documentación disponible en: http://localhost:3000/api-docs
```

---

### FIGURA 8 — `08-docker-compose-up.png`

**Dónde:** Terminal.

**Qué ejecutar:**
```bash
docker compose up -d
docker compose ps
```

**Qué debe verse:** los dos contenedores creados y el resultado de `ps` con ambos en estado `running` / `healthy`.

> **Si no vas a usar Docker:** puedes omitir esta figura y eliminar el bloque completo de la sección 3.2 del manual. Es una opción alternativa de instalación, no un requisito. Si tienes Docker Desktop, vale la pena incluirla: suma valor a la evidencia.

---

## Bloque 2 · Primer arranque (Figuras 9 y 10)

### FIGURA 9 — `09-api-funcionando.png`

**Dónde:** Navegador.

**Qué abrir:** `http://localhost:3000`

**Qué debe verse:** la respuesta JSON:
```json
{
  "message": "API RiwiMediCare Plus funcionando.",
  "documentacion": "/api-docs"
}
```

Que se vea la barra de direcciones con la URL.

---

### FIGURA 10 — `10-swagger-completo.png`

**Dónde:** Navegador.

**Qué abrir:** `http://localhost:3000/api-docs`

**Qué debe verse:** la vista general de Swagger con los seis grupos de endpoints colapsados: Auth, Clínicas, Almacenes, Medicamentos, Inventario, Solicitudes. Debe verse también el botón **Authorize** en la parte superior derecha.

---

## Bloque 3 · Autenticación (Figuras 11 a 13)

### FIGURA 11 — `11-register-201.png`

**Dónde:** Swagger → `POST /api/auth/register`

**Pasos:** desplegar el endpoint → **Try it out** → pegar el cuerpo → **Execute**.

**Cuerpo exacto:**
```json
{
  "first_name": "Dylan Alberto",
  "last_name": "Suarez Laverde",
  "email": "nuevo.usuario@riwimedicare.com",
  "password": "clave1234",
  "role": "administrador"
}
```

**Qué debe verse:** el código **201** y el `Response body` con el usuario creado. Comprueba que **no aparece** el campo `password_hash`.

---

### FIGURA 12 — `12-login-token.png`

**Dónde:** Swagger → `POST /api/auth/login`

**Cuerpo exacto:**
```json
{
  "email": "dylan.suarez@riwimedicare.com",
  "password": "admin1234"
}
```

**Qué debe verse:** el código **200** y el `Response body` con el `token` y el objeto `usuario` con `"role": "administrador"`.

**Copia el token ahora.** Lo necesitas para el resto de capturas.

---

### FIGURA 13 — `13-authorize.png`

**Dónde:** Swagger → botón **Authorize**.

**Pasos:** pulsar **Authorize** → pegar el token (sin la palabra `Bearer`) → **Authorize** → **Close**.

**Qué debe verse:** el cuadro de diálogo abierto con el token pegado en el campo, antes de cerrarlo.

> Después de esta captura, deja la sesión autorizada. Todas las figuras siguientes hasta la 23 la necesitan.

---

## Bloque 4 · Funcionalidades (Figuras 14 a 23)

### FIGURA 14 — `14-get-clinicas.png`

**Dónde:** Swagger → `GET /api/clinicas` → **Try it out** → **Execute**.

**Qué debe verse:** código **200** y el listado con las tres clínicas de los seeders. Se debe apreciar `total: 3`.

**Anota de aquí:** el `id` de una clínica. Lo necesitas para las figuras 18 y 23.

---

### FIGURA 15 — `15-post-clinica-201.png`

**Dónde:** Swagger → `POST /api/clinicas`

**Cuerpo exacto:**
```json
{
  "nombre": "Clinica Los Andes",
  "nit": "905678901-7",
  "direccion": "Carrera 70 N 45-22, Medellin",
  "telefono": "6045554040",
  "email": "contacto@clinicalosandes.com",
  "responsable_nombre": "Mariana Ospina",
  "responsable_email": "mariana.ospina@clinicalosandes.com",
  "responsable_telefono": "3009876543"
}
```

**Qué debe verse:** código **201** y la clínica creada con su `id` UUID e `is_active: true`.

> Usa el NIT `905678901-7`, que no existe en los seeders. Lo vas a reutilizar en la figura 28 para provocar el error de duplicado.

---

### FIGURA 16 — `16-get-medicamentos.png`

**Dónde:** Swagger → `GET /api/medicamentos` → **Execute**.

**Qué debe verse:** código **200** y los seis medicamentos del catálogo con `nombre`, `presentacion` y `laboratorio`.

**Anota de aquí:** el `id` de un medicamento. Lo necesitas para la figura 18.

---

### FIGURA 17 — `17-inventario-antes.png` ⚠️ CLAVE

**Dónde:** Swagger → `GET /api/inventario` → **Execute**.

**Qué debe verse:** código **200** y los nueve registros de inventario con su `cantidad`.

**Anota de aquí:**
- El `id` de un almacén (dentro del objeto `almacen` anidado). Lo necesitas para la figura 18.
- La **cantidad exacta** del medicamento que vas a solicitar en ese almacén.

> **Esta captura es la mitad de una pareja.** La figura 21 muestra el mismo listado después de aprobar la solicitud, con la cantidad ya descontada. Juntas son la evidencia más fuerte del manual: demuestran que el descuento automático funciona. Asegúrate de que la cantidad se lea con claridad.

---

### FIGURA 18 — `18-post-solicitud-201.png`

**Dónde:** Swagger → `POST /api/solicitudes`

**Cuerpo:** reemplaza los UUID por los que anotaste en las figuras 14, 16 y 17.
```json
{
  "clinica_id": "PEGA-AQUI-EL-UUID-DE-LA-CLINICA",
  "medicamento_id": "PEGA-AQUI-EL-UUID-DEL-MEDICAMENTO",
  "almacen_id": "PEGA-AQUI-EL-UUID-DEL-ALMACEN",
  "cantidad_solicitada": 120,
  "observaciones": "Reposicion mensual del servicio de urgencias"
}
```

**Qué debe verse:** código **201**, `"estado": "pendiente"` y las relaciones resueltas (los objetos `clinica`, `medicamento`, `almacen` y `usuario` anidados, no solo los UUID).

**Anota de aquí:** el `id` de la solicitud creada. Lo necesitas para las figuras 20, 27 y 30.

> Si `120` supera la cantidad disponible en ese almacén, usa un número menor. Ajusta también el texto del manual si cambias el valor.

---

### FIGURA 19 — `19-get-solicitudes.png`

**Dónde:** Swagger → `GET /api/solicitudes` → **Execute**.

**Qué debe verse:** código **200** y el listado de solicitudes en curso. Solo deben aparecer las de estado `pendiente` y `aprobada` — ninguna `rechazada`, `entregada` ni `cancelada`. Eso es exactamente lo que el documento afirma.

---

### FIGURA 20 — `20-aprobar-solicitud.png` ⚠️ CLAVE

**Dónde:** Swagger → `PATCH /api/solicitudes/{id}/estado`

**Parámetro `id`:** el UUID de la solicitud de la figura 18.

**Cuerpo exacto:**
```json
{
  "estado": "aprobada",
  "observaciones": "Aprobada segun disponibilidad verificada"
}
```

**Qué debe verse:** código **200** y `"estado": "aprobada"` en la respuesta.

---

### FIGURA 21 — `21-inventario-despues.png` ⚠️ CLAVE

**Dónde:** Swagger → `GET /api/inventario` → **Execute** (otra vez).

**Qué debe verse:** el mismo listado de la figura 17, pero con la cantidad de ese medicamento en ese almacén **reducida en 120 unidades**.

> Si en la figura 17 el valor era 500, aquí debe ser 380. Ese contraste es la prueba del descuento automático. Encuadra la captura igual que la 17 para que la comparación sea inmediata.

---

### FIGURA 22 — `22-historial-solicitudes.png`

**Dónde:** Swagger → `GET /api/solicitudes/historial` → **Execute**.

**Qué debe verse:** código **200** y solicitudes en **varios estados distintos**. Los seeders cargan una solicitud por cada estado, así que deberían aparecer las cinco etiquetas: `pendiente`, `aprobada`, `rechazada`, `entregada`, `cancelada`.

> Si el listado es largo, captura la parte donde se aprecien al menos tres estados diferentes. Es lo que demuestra la diferencia con la figura 19.

---

### FIGURA 23 — `23-solicitudes-por-clinica.png`

**Dónde:** Swagger → `GET /api/clinicas/{id}/solicitudes`

**Parámetro `id`:** el UUID de la clínica de la figura 14.

**Qué debe verse:** código **200** y solo las solicitudes de esa clínica.

---

## Bloque 5 · Validaciones (Figuras 24 a 31)

> Estas capturas provocan errores **a propósito**. Son la evidencia de que las reglas de negocio funcionan, y suelen ser lo que un evaluador revisa con más atención. No las omitas.

### FIGURA 24 — `24-error-401-sin-token.png`

**Pasos:**
1. Pulsa **Authorize** → **Logout** → **Close**.
2. Ejecuta `GET /api/clinicas`.

**Qué debe verse:** código **401** y `{ "message": "Token no proporcionado." }`

---

### FIGURA 25 — `25-error-403-rol.png`

**Pasos:**
1. Ejecuta `POST /api/auth/login` con el **gestor**:
```json
{
  "email": "abrahan.villa@riwimedicare.com",
  "password": "gestor1234"
}
```
2. Copia ese token y autorízate con él.
3. Intenta `POST /api/clinicas` con cualquier cuerpo válido.

**Qué debe verse:** código **403** y `{ "message": "No tiene permisos para realizar esta acción." }`

> **Vuelve a autorizarte como administrador** antes de continuar con la figura 26.

---

### FIGURA 26 — `26-error-400-inventario.png`

**Dónde:** Swagger → `POST /api/solicitudes`

**Cuerpo:** los mismos UUID de la figura 18, pero con una cantidad imposible:
```json
{
  "clinica_id": "EL-MISMO-UUID-DE-LA-FIGURA-18",
  "medicamento_id": "EL-MISMO-UUID-DE-LA-FIGURA-18",
  "almacen_id": "EL-MISMO-UUID-DE-LA-FIGURA-18",
  "cantidad_solicitada": 99999
}
```

**Qué debe verse:** código **400** y la respuesta con los tres campos:
```json
{
  "message": "El almacén no tiene inventario suficiente de ese medicamento.",
  "cantidad_solicitada": 99999,
  "cantidad_disponible": 380
}
```

---

### FIGURA 27 — `27-error-400-transicion.png` ⚠️ CLAVE

**Dónde:** Swagger → `PATCH /api/solicitudes/{id}/estado`

**Parámetro `id`:** el UUID de una solicitud que esté en estado **pendiente**. Usa una de los seeders (búscala en la figura 19), no la de la figura 18, que ya aprobaste.

**Cuerpo exacto:**
```json
{
  "estado": "entregada"
}
```

**Qué debe verse:** código **400** con los tres campos:
```json
{
  "message": "No se puede pasar de 'pendiente' a 'entregada'.",
  "estado_actual": "pendiente",
  "estados_permitidos": "aprobada, rechazada, cancelada"
}
```

> Es la evidencia de la máquina de estados y uno de los puntos fuertes del proyecto. Que se lea completa.

---

### FIGURA 28 — `28-error-409-nit.png`

**Dónde:** Swagger → `POST /api/clinicas`

**Cuerpo:** el mismo NIT de la figura 15, con cualquier otro nombre:
```json
{
  "nombre": "Clinica Duplicada de Prueba",
  "nit": "905678901-7",
  "direccion": "Calle 10 N 20-30, Medellin",
  "telefono": "6045551111",
  "email": "prueba@duplicada.com",
  "responsable_nombre": "Juan Perez",
  "responsable_email": "juan.perez@duplicada.com",
  "responsable_telefono": "3001112233"
}
```

**Qué debe verse:** código **409** y `{ "message": "Ya existe una clínica registrada con el NIT 905678901-7." }`

---

### FIGURA 29 — `29-error-400-cantidad.png`

**Dónde:** Swagger → `POST /api/solicitudes`

**Cuerpo:** los mismos UUID, con cantidad cero:
```json
{
  "clinica_id": "LOS-MISMOS-UUID",
  "medicamento_id": "LOS-MISMOS-UUID",
  "almacen_id": "LOS-MISMOS-UUID",
  "cantidad_solicitada": 0
}
```

**Qué debe verse:** código **400** con el array `errors` señalando el campo exacto:
```json
{
  "message": "Datos inválidos o incompletos.",
  "errors": [
    { "campo": "cantidad_solicitada",
      "detalle": "La cantidad solicitada debe ser mayor que cero." }
  ]
}
```

---

### FIGURA 30 — `30-reintegro-inventario.png` ⚠️ CLAVE

**Pasos:**
1. `PATCH /api/solicitudes/{id}/estado` con el `id` de la solicitud **que aprobaste en la figura 20**:
```json
{
  "estado": "cancelada",
  "observaciones": "Cancelada por solicitud de la clinica"
}
```
2. Ejecuta `GET /api/inventario`.

**Qué debe verse:** la cantidad de vuelta en su valor original (las 120 unidades reintegradas). Si en la figura 21 quedó en 380, aquí debe volver a 500.

> Captura **el inventario después de cancelar**, no el PATCH. Idealmente, encuadra igual que las figuras 17 y 21 para que las tres formen una secuencia legible: 500 → 380 → 500.

---

### FIGURA 31 — `31-base-de-datos.png`

**Dónde:** pgAdmin, DBeaver, o la extensión PostgreSQL de VS Code.

**Qué hacer:** conectar a la base `db_nodejs` y mostrar:
- El árbol de tablas con las seis del dominio: `users`, `clinicas`, `almacenes`, `medicamentos`, `inventario`, `solicitudes`.
- El contenido de la tabla `solicitudes` con sus filas.

**Alternativa sin cliente gráfico** — desde la terminal:
```bash
psql -U admin -d db_nodejs -c "\dt"
psql -U admin -d db_nodejs -c "SELECT estado, cantidad_solicitada, is_active FROM solicitudes;"
```

---

## Resumen: las 6 capturas que más pesan en la evaluación

Si el tiempo aprieta, prioriza estas. Son las que demuestran que el sistema hace lo que el diseño prometió:

| Figura | Archivo | Qué demuestra |
|---|---|---|
| **17 + 21 + 30** | inventario antes / después / reintegro | El descuento y el reintegro automáticos del inventario funcionan. Es el núcleo del proyecto. |
| **27** | error de transición | La máquina de estados impide saltos inválidos. |
| **25** | error 403 | El control de acceso por rol funciona. |
| **26** | error de inventario | La validación de disponibilidad funciona. |
| **20** | aprobación | El cambio de estado con transacción funciona. |
| **10** | Swagger completo | Los 30 endpoints están documentados. |

---

## Lista de verificación

- [ ] 01 · Versiones instaladas
- [ ] 02 · Repositorio clonado
- [ ] 03 · npm install
- [ ] 04 · Archivo .env (credenciales ocultas)
- [ ] 05 · npm run migrate
- [ ] 06 · npm run seed
- [ ] 07 · Servidor corriendo
- [ ] 08 · Docker compose *(opcional)*
- [ ] 09 · API funcionando
- [ ] 10 · Swagger completo
- [ ] 11 · Register 201
- [ ] 12 · Login con token
- [ ] 13 · Authorize
- [ ] 14 · GET clínicas
- [ ] 15 · POST clínica 201
- [ ] 16 · GET medicamentos
- [ ] 17 · Inventario ANTES
- [ ] 18 · POST solicitud 201
- [ ] 19 · GET solicitudes
- [ ] 20 · Aprobar solicitud
- [ ] 21 · Inventario DESPUÉS
- [ ] 22 · Historial
- [ ] 23 · Solicitudes por clínica
- [ ] 24 · Error 401
- [ ] 25 · Error 403
- [ ] 26 · Error 400 inventario
- [ ] 27 · Error 400 transición
- [ ] 28 · Error 409 NIT
- [ ] 29 · Error 400 cantidad
- [ ] 30 · Reintegro de inventario
- [ ] 31 · Base de datos
