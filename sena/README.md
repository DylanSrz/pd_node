# Documentación SENA — API RiwiMediCare Plus

Evidencias de producto para las dos normas de competencia solicitadas.

**Aprendiz:** Dylan Alberto Suárez Laverde
**Proyecto:** API RiwiMediCare Plus — https://github.com/DylanSrz/pd_node

---

## Las dos entregas

| Carpeta | Norma | Competencia | Formulario |
|---|---|---|---|
| [`sena1/`](sena1/) | **220501095** | Diseñar la solución de software | https://forms.gle/xtd48BgaPFEHzRAJ7 |
| [`sena2/`](sena2/) | **220501096** | Desarrollar solución de software | https://forms.gle/485g3veWL9CnBGKC7 |

---

## Qué se generó

### SENA 1 · Diseño (4 productos)

| # | Producto | Archivo |
|---|---|---|
| 1 | Documento de diseño de software | `sena1/01-documento-diseno-software.html` |
| 2 | Diagramas UML (6 diagramas) | `sena1/diagramas/*.drawio` |
| 3 | Prototipo de solución (10 wireframes) | `sena1/prototipo/10-prototipo-wireframes.html` |
| 4 | Modelo de base de datos | `sena1/modelo-datos/07`, `08`, `09` |

### SENA 2 · Desarrollo (3 productos)

| # | Producto | Archivo |
|---|---|---|
| 1 | Documento técnico de código fuente | `sena2/01-documento-tecnico-codigo-fuente.html` |
| 2 | Manual de usuario / instructivo | `sena2/02-manual-de-usuario.html` |
| 3 | Entrega de la solución de software | `sena2/04-entrega-solucion-software.html` |

Total: **6 documentos HTML**, **7 diagramas editables**, **1 guion SQL** y **1 guía de capturas**.

---

## Cómo generar los PDF

Todos los documentos son archivos `.html` autocontenidos. No necesitan servidor ni internet.

1. Abre el archivo en Chrome, Edge o Firefox (doble clic).
2. `Ctrl + P`
3. **Destino:** Guardar como PDF
4. **Márgenes:** Predeterminado
5. **Marca la casilla "Gráficos de fondo"** ← imprescindible
6. Guardar

> Cada documento muestra una barra verde en la parte superior con este recordatorio. Esa barra no sale en el PDF.

**Si olvidas "Gráficos de fondo"**, el PDF sale sin colores de fondo en tablas, avisos y portada: se pierde todo el diseño. Es el error más común.

---

## Cómo abrir y exportar los diagramas

Los archivos `.drawio` son diagramas **editables**, no imágenes. Se abren en draw.io.

**Sin instalar nada:** entra a https://app.diagrams.net → *Open Existing Diagram* → selecciona el archivo.

**En VS Code:** instala la extensión **Draw.io Integration** (`hediet.vscode-drawio`) y haz doble clic en el archivo.

**Para exportar a imagen:** Archivo → Exportar como → PNG, con *Zoom: 200%*.

Entrega tanto el PNG como el `.drawio`: el PNG para que se vea de inmediato, el `.drawio` como prueba de que el diagrama es editable y propio.

---

## Lo único que falta por hacer

### 1. Las capturas de pantalla (obligatorio)

El manual de usuario tiene **31 espacios reservados** para capturas del sistema funcionando. Son evidencia real: no se pueden generar, hay que tomarlas.

**Sigue `sena2/03-guia-de-capturas.md`.** Es una guía paso a paso que indica, para cada figura, qué abrir, qué endpoint ejecutar, con qué datos JSON exactos y cómo nombrar el archivo.

Si el tiempo aprieta, la guía señala **6 capturas prioritarias** que son las que demuestran las reglas de negocio del sistema.

### 2. Los datos institucionales (obligatorio)

Las portadas de los 6 documentos tienen campos resaltados en amarillo con este aspecto:

```
[ Nombre del programa de formación ]
[ Número de ficha ]
[ Nombre del instructor ]
[ Centro de formación ]
[ Fecha de entrega ]
```

Búscalos con `Ctrl + F` en cada `.html` y reemplázalos por tus datos reales. Para quitar el resaltado amarillo, elimina el `<span class="rellenar">` que los envuelve.

**Atajo:** ejecuta esto en la carpeta `sena/` para reemplazarlos todos de una vez (ajusta los valores):

```bash
cd sena
sed -i 's/\[ Nombre del programa de formación \]/Análisis y Desarrollo de Software/g' sena1/*.html sena1/*/*.html sena2/*.html
sed -i 's/\[ Número de ficha \]/2853214/g' sena1/*.html sena1/*/*.html sena2/*.html
sed -i 's/\[ Nombre del instructor \]/Nombre Real del Instructor/g' sena1/*.html sena1/*/*.html sena2/*.html
sed -i 's/\[ Centro de formación \]/Centro de Servicios y Gestión Empresarial/g' sena1/*.html sena1/*/*.html sena2/*.html
sed -i 's/\[ Fecha de entrega \]/3 de septiembre de 2026/g' sena1/*.html sena1/*/*.html sena2/*.html
```

### 3. El logo del SENA (recomendado)

Cada portada tiene un recuadro punteado con la palabra `LOGO SENA`. Reemplaza el bloque `<svg>...</svg>` por:

```html
<img src="logo-sena.png" alt="SENA" style="width:96px;height:96px;">
```

Coloca el archivo `logo-sena.png` en la misma carpeta que el HTML.

---

## Nota sobre el prototipo

El proyecto entregado es una **API REST sin frontend implementado**, pero la norma 220501095 exige un prototipo con wireframes de pantallas.

Esto se resolvió diseñando los wireframes de la interfaz web que consumiría la API, declarando explícitamente en el documento que se trata del *diseño propuesto de la capa de presentación* y no de una interfaz ya construida. Cada pantalla está vinculada al endpoint real que la alimentaría.

Es la respuesta correcta a la norma: en la etapa de **diseño**, el prototipo es precisamente lo que se entrega antes de programar la interfaz.

---

## Verificación de contenido

Todo el contenido de estos documentos fue extraído del código fuente real del proyecto y verificado contra él:

- Los fragmentos de código son literales, con sus comentarios originales.
- El diagrama entidad-relación y el guion SQL coinciden con la estructura de `backup.sql`.
- Los 30 endpoints, los 5 estados, las 5 transiciones, las 6 llaves foráneas, las 3 restricciones de unicidad y las 2 de verificación fueron contados sobre el código, no estimados.
- El historial de commits proviene del repositorio.

---

## Checklist general

**SENA 1**
- [ ] Reemplazar datos institucionales en las 3 portadas
- [ ] Imprimir a PDF los 3 documentos HTML
- [ ] Exportar los 6 diagramas UML a PNG
- [ ] Exportar el modelo entidad-relación a PNG
- [ ] Subir al formulario de la norma 220501095

**SENA 2**
- [ ] Tomar las 31 capturas de pantalla
- [ ] Insertarlas en el manual de usuario
- [ ] Reemplazar datos institucionales en las 3 portadas
- [ ] Imprimir a PDF los 3 documentos HTML
- [ ] Verificar que la rama `main` del repositorio está actualizada
- [ ] Subir al formulario de la norma 220501096
