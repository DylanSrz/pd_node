# SENA 1 — Norma 220501095

**Diseñar la solución de software de acuerdo con procedimientos y requisitos técnicos**

Evidencia de producto para la API RiwiMediCare Plus.
Formulario de entrega: https://forms.gle/xtd48BgaPFEHzRAJ7

---

## Los 4 productos que pide la norma

| # | Producto solicitado | Archivo(s) en esta carpeta | Estado |
|---|---|---|---|
| 1 | Documento de diseño de software | `01-documento-diseno-software.html` | ✅ Generado |
| 2 | Diagramas UML | `diagramas/01` … `06` (`.drawio`) | ⚠️ Generados — exportar a PNG |
| 3 | Prototipo de solución de software | `prototipo/10-prototipo-wireframes.html` | ✅ Generado |
| 4 | Modelo de base de datos | `modelo-datos/07`, `08`, `09` | ⚠️ Generados — exportar el DER a PNG |

---

## Contenido detallado

```
sena1/
├── 01-documento-diseno-software.html      ← Producto 1
│
├── diagramas/                             ← Producto 2
│   ├── 01-casos-de-uso.drawio
│   ├── 02-diagrama-clases.drawio
│   ├── 03-secuencia-crear-solicitud.drawio
│   ├── 04-secuencia-aprobar-solicitud.drawio
│   ├── 05-actividad-ciclo-solicitud.drawio
│   └── 06-componentes-arquitectura.drawio
│
├── prototipo/                             ← Producto 3
│   └── 10-prototipo-wireframes.html
│
└── modelo-datos/                          ← Producto 4
    ├── 07-modelo-entidad-relacion.drawio
    ├── 08-esquema.sql
    └── 09-diccionario-de-datos.html
```

---

## Producto 1 · Documento de diseño de software

`01-documento-diseno-software.html` — 12 secciones, ~40 páginas al imprimir.

Cubre los cinco puntos que exige la norma:

| Lo que pide la norma | Sección del documento |
|---|---|
| Descripción del problema a resolver | 2 |
| Objetivos del sistema | 3 |
| Actores o usuarios | 4 |
| Requisitos funcionales y no funcionales | 5 |
| Arquitectura de la solución | 6 |
| Tecnologías a utilizar | 8 |

Además incluye: introducción y glosario (1), descripción de módulos (7), justificación técnica de cada decisión (9), modelo de datos (10), consideraciones de seguridad (11) y anexos (12).

**Para generar el PDF:** ábrelo en el navegador y pulsa `Ctrl + P` → Destino: *Guardar como PDF* → Márgenes: *Predeterminado* → **activa "Gráficos de fondo"**.

> Sin "Gráficos de fondo" activado, el PDF sale en blanco y negro y se pierde el diseño. Es la casilla más fácil de olvidar.

---

## Producto 2 · Diagramas UML

Seis diagramas en formato `.drawio` nativo, totalmente editables.

| Archivo | Tipo de diagrama | Qué representa |
|---|---|---|
| `01-casos-de-uso` | Casos de uso | 14 casos, 3 actores, relaciones `include` y generalización |
| `02-diagrama-clases` | Clases | 6 modelos del dominio con atributos, tipos y cardinalidades |
| `03-secuencia-crear-solicitud` | Secuencia | Los 27 mensajes de crear una solicitud, con flujos alternativos |
| `04-secuencia-aprobar-solicitud` | Secuencia | Aprobación con transacción y bloqueo de fila |
| `05-actividad-ciclo-solicitud` | Actividad | Ciclo de vida completo con todas las decisiones |
| `06-componentes-arquitectura` | Componentes | Las 6 capas y sus componentes |

### Cómo abrirlos y exportarlos

**Opción A — Navegador (no requiere instalar nada):**
1. Entra a https://app.diagrams.net
2. *Open Existing Diagram* → selecciona el archivo `.drawio`
3. Para exportar: **Archivo → Exportar como → PNG** (marca *Transparent Background: No*, *Zoom: 200%*)

**Opción B — Visual Studio Code:**
1. Instala la extensión **Draw.io Integration** (hediet.vscode-drawio)
2. Haz doble clic en el archivo `.drawio` — se abre el editor dentro de VS Code

**Opción C — Aplicación de escritorio:**
Descarga draw.io Desktop desde https://github.com/jgraph/drawio-desktop/releases

### Recomendación para la entrega

Exporta cada diagrama a **PNG a 200 % de zoom** y guárdalos junto a los `.drawio`. Entrega ambos: el PNG para que se vea sin instalar nada, y el `.drawio` como prueba de que el diagrama es tuyo y es editable.

---

## Producto 3 · Prototipo de solución de software

`prototipo/10-prototipo-wireframes.html`

10 wireframes de las pantallas principales de la interfaz web propuesta, con:
- Mapa de navegación entre pantallas
- Anotaciones numeradas en cada pantalla explicando las decisiones de diseño
- El endpoint de la API que alimenta cada pantalla
- Tabla de trazabilidad entre requisitos funcionales y pantallas

| Pantalla | Contenido |
|---|---|
| P-01 | Inicio de sesión |
| P-02 | Registro de usuario |
| P-03 | Panel principal con indicadores |
| P-04 | Listado de clínicas |
| P-05 | Formulario de clínica |
| P-06 | Almacenes y medicamentos |
| P-07 | Control de inventario |
| P-08 | Listado de solicitudes |
| P-09 | Nueva solicitud |
| P-10 | Detalle y cambio de estado |

**Nota sobre el alcance:** el proyecto entregado es una API REST sin frontend implementado. El documento lo declara explícitamente en su sección 1 y presenta estos wireframes como *diseño propuesto de la capa de presentación*, que es exactamente lo que corresponde a la etapa de diseño de la norma 220501095.

Si quieres llevarlos a alta fidelidad, puedes reconstruirlos en Figma o Canva usando estos como base.

---

## Producto 4 · Modelo de base de datos

| Archivo | Contenido |
|---|---|
| `07-modelo-entidad-relacion.drawio` | DER completo: 6 tablas con todas sus columnas, tipos, PK, FK y cardinalidades en notación de pata de gallo |
| `08-esquema.sql` | Guion SQL comentado: tipos enumerados, tablas, llaves, restricciones e índices recomendados |
| `09-diccionario-de-datos.html` | Diccionario columna por columna, relaciones, verificación de las tres formas normales y datos de prueba |

El diagrama y el guion SQL fueron verificados contra el `backup.sql` real del proyecto: coinciden exactamente con la estructura que producen las migraciones.

---

## Antes de entregar

- [ ] Reemplazar los campos resaltados en amarillo de las portadas: programa, ficha, instructor, centro y fecha
- [ ] Insertar el logo del SENA en las portadas (hay un recuadro punteado reservado)
- [ ] Imprimir los 3 documentos HTML a PDF con "Gráficos de fondo" activado
- [ ] Exportar los 6 diagramas UML a PNG
- [ ] Exportar el modelo entidad-relación a PNG
- [ ] Subir todo al formulario: https://forms.gle/xtd48BgaPFEHzRAJ7
