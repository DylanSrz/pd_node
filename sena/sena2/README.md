# SENA 2 — Norma 220501096

**Desarrollar solución de software de acuerdo con especificaciones de diseño y marcos de referencia**

Evidencia de producto para la API RiwiMediCare Plus.
Formulario de entrega: https://forms.gle/485g3veWL9CnBGKC7

---

## Los 3 productos que pide la norma

| Etapa | Evidencia | Archivo en esta carpeta | Estado |
|---|---|---|---|
| Explicar cómo está construido el sistema | Documento técnico | `01-documento-tecnico-codigo-fuente.html` | ✅ Generado |
| Explicar cómo usar el sistema | Instructivo | `02-manual-de-usuario.html` | ⚠️ Falta insertar capturas |
| Mostrar el sistema funcionando | Solución de software | `04-entrega-solucion-software.html` + repositorio | ✅ Generado |

---

## Contenido

```
sena2/
├── 01-documento-tecnico-codigo-fuente.html   ← Producto 1
├── 02-manual-de-usuario.html                 ← Producto 2
├── 03-guia-de-capturas.md                    ← Instrucciones para completar el 02
├── 04-entrega-solucion-software.html         ← Producto 3
└── capturas/                                 ← Aquí van tus 31 capturas
```

---

## Producto 1 · Documento técnico de código fuente

`01-documento-tecnico-codigo-fuente.html` — 12 secciones, ~35 páginas.

Cubre los cinco puntos que exige la norma:

| Lo que pide la norma | Sección |
|---|---|
| Estructura del proyecto | 1 |
| Descripción de carpetas y módulos | 1.2 y 1.3 |
| Explicación del flujo del sistema | 3 |
| Fragmentos de código relevantes comentados | 4 a 10 |
| Tecnologías usadas | 2 |

Además: buenas prácticas de programación aplicadas (11) y métricas del código (12).

Los fragmentos de código son **reales**, extraídos directamente del proyecto con sus comentarios originales, y cada uno viene acompañado de la explicación de la decisión técnica que representa: por qué se bloquea la fila de inventario, por qué las asociaciones están centralizadas, por qué `/historial` va declarada antes que `/:id`, etc.

**Para generar el PDF:** `Ctrl + P` → *Guardar como PDF* → **activa "Gráficos de fondo"**.

---

## Producto 2 · Manual de usuario ⚠️ Requiere tu trabajo

`02-manual-de-usuario.html` — 9 secciones, ~30 páginas.

Cubre los cuatro puntos que exige la norma:

| Lo que pide la norma | Sección |
|---|---|
| Requisitos del sistema | 2 |
| Pasos de instalación o ejecución | 3 y 4 |
| Descripción de las funcionalidades | 5, 6 y 8 |
| Capturas de pantalla del sistema | **31 espacios reservados** |

Incluye además una sección completa de comprobación de validaciones (7) y solución de problemas frecuentes (9).

### Lo que falta hacer

El documento tiene **31 recuadros verdes punteados** que dicen `FIGURA N`. Cada uno es un espacio para una captura de pantalla que tú debes tomar.

**Sigue `03-guia-de-capturas.md`**: te dice, para cada figura, qué abrir, qué endpoint ejecutar, con qué datos JSON exactos, y cómo nombrar el archivo.

### Si tienes poco tiempo

La guía marca 6 capturas como prioritarias. Son las que un evaluador revisa con más atención porque demuestran las reglas de negocio del sistema:

- **Figuras 17, 21 y 30** — inventario antes de aprobar, después de aprobar, y tras cancelar. La secuencia `500 → 380 → 500` es la prueba del descuento y el reintegro automáticos.
- **Figura 27** — error 400 al intentar una transición de estado inválida.
- **Figura 25** — error 403 al operar con un rol sin permisos.
- **Figura 26** — error 400 por inventario insuficiente.

---

## Producto 3 · Solución de software

`04-entrega-solucion-software.html` documenta la entrega del sistema funcional:

- Identificación de la solución y del repositorio
- Historial de desarrollo (11 confirmaciones)
- Inventario de lo entregado
- **Trazabilidad de los 21 requisitos funcionales** con el archivo donde está implementado cada uno
- Evidencia de la integración con la base de datos
- **Guía de verificación de 14 pasos para el evaluador** — un recorrido que demuestra el sistema completo en unos minutos
- Lista de verificación final

Los elementos materiales del producto son:

| Elemento que pide la norma | Dónde está |
|---|---|
| Repositorio en GitHub | https://github.com/DylanSrz/pd_node |
| Código fuente completo | `src/` — 67 archivos TypeScript |
| Base de datos o scripts SQL | `backup.sql` en la raíz + `sena1/modelo-datos/08-esquema.sql` |
| API funcionando | `npm run dev` o `docker compose up -d` → `/api-docs` |

---

## Antes de entregar

- [ ] Tomar las 31 capturas siguiendo `03-guia-de-capturas.md`
- [ ] Guardarlas en `capturas/` con los nombres indicados
- [ ] Insertarlas en `02-manual-de-usuario.html` reemplazando los bloques `hueco-captura`
- [ ] Reemplazar los campos resaltados en amarillo de las portadas: programa, ficha, instructor, centro y fecha
- [ ] Insertar el logo del SENA en las portadas
- [ ] Verificar que la rama `main` del repositorio está actualizada
- [ ] Confirmar que `.env` **no** está versionado y `.env.example` sí lo está
- [ ] Imprimir los 3 documentos HTML a PDF con "Gráficos de fondo" activado
- [ ] Subir todo al formulario: https://forms.gle/485g3veWL9CnBGKC7
