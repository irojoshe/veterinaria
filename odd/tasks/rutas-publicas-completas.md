# Rutas públicas completas

## Objetivo
Cerrar los 404 del sitio público: detalle de servicio, mascotas, contacto y privacidad como
páginas navegables reales, más dos fixes de calidad (H2 duplicado y ruido de `force-dynamic`).

## Problema
La auditoría del HTML prerenderizado detectó 4 destinos inexistentes con 20 links:

| Ruta | Links | Orígenes |
| --- | --- | --- |
| `/servicios/[slug]` | 10 | `ServiciosDestacados.tsx:82`, `servicios/_components/ServicioCard.tsx:36` |
| `/mascotas` | 5 | Navbar desktop+móvil, footer, `ComunidadSection.tsx:54,93` |
| `/contacto` | 4 | Navbar desktop+móvil, footer, `ContactoSection.tsx:53` |
| `/privacidad` | 1 | footer |

Los requisitos funcionales RF08, RF11 y RF16 exigen páginas navegables, no anclas a la home.

## Por qué
Un CTA que lleva a un 404 destruye la confianza en la clínica y es un bug de producción,
no un detalle cosmético. Además, `/servicios/[slug]` es la única forma de que "Ver detalle ↗"
signifique algo.

## Alcance

### T1 · Detalle del servicio
- `getServicioBySlug(slug: string)` en `src/lib/services/servicios.ts`.
  Cliente público + `unstable_cache`. Columnas exactas: las 7 de `COLUMNAS_SERVICIO`.
  Filtra `publicado = true`. `try/catch` → `null`.
- `src/app/(public)/servicios/[slug]/page.tsx`: imagen, nombre, descripción, precio,
  duración y botón a `/cita?servicio=slug`. `generateStaticParams` con los servicios
  publicados. `notFound()` si no existe.
- La página `/cita` lee `?servicio=` y preselecciona el servicio en el formulario
  (el `<select>` de `SeccionPreferencias.tsx` usa `s.slug` como value).

### T2 · Página de mascotas
- `getMascotasPublicas()` en `src/lib/services/mascotas.ts`.
  Cliente público + `unstable_cache`. Columnas exactas: `id, nombre, especie, raza, sexo,
  fecha_nacimiento, foto_url`. Filtra `publicado = true`. `try/catch` → `[]`.
- `src/app/(public)/mascotas/page.tsx` + `_components/MascotaCard.tsx`.
  Fallback de imagen: `/images/placeholder-mascota.jpg`.
- Script SQL con 2 mascotas de prueba (la tabla está vacía).

### T3 · Contacto y privacidad
- `getNegocio()` pasa a leer la tabla real `negocio` con cliente público + caché.
  Columnas exactas: `nombre, descripcion, direccion, telefono, email, whatsapp, horario,
  mapa_url`. La fila actual (id=1) tiene todo en NULL: se mergean defaults para que la
  página nunca quede en blanco, y los valores reales ganan en cuanto se rellene la fila.
- `src/app/(public)/contacto/page.tsx`: dirección, teléfono, email, whatsapp, horario y mapa.
- `src/app/(public)/privacidad/page.tsx`: política de privacidad estructurada.

### T4 · Fixes finales
- `InvitacionFinalSection.tsx`: un solo `<h2>` con dos `<span>` responsivas.
- `src/app/admin/layout.tsx`: `export const dynamic = 'force-dynamic'`.

## Restricciones
- Quality Gate: ningún componente o archivo nuevo supera 150 líneas.
- Prohibido `SELECT *`: exactamente las columnas que la UI consume.
- Lecturas públicas: cliente sin cookies + `unstable_cache`. Admin: cliente con cookies, sin caché.
- Una sola query lineal por lectura. Sin recursión, sin bucles de consultas.
- Todo `try/catch` con fallback explícito.
- Artefactos técnicos en inglés; copy de UI en español.
- `next.config.js` es CommonJS y CRLF: no tocar salvo que sea inevitable (no hace falta).

## Criterios de aceptación
- [ ] `npx tsc --noEmit` sale con código 0.
- [ ] `/servicios/[slug]`, `/mascotas`, `/contacto`, `/privacidad` devuelven 200.
- [ ] Los 7 servicios publicados tienen su página de detalle por slug.
- [ ] `/cita?servicio=consulta-general` preselecciona "Consulta General".
- [ ] La tabla `mascotas` tiene 2 filas de prueba visibles en `/mascotas`.
- [ ] El build no muestra `Dynamic server usage` en las rutas admin.
- [ ] Un solo `<h2>` en el DOM de la sección de invitación final.

## Checks aplicables
- `npx tsc --noEmit` (runner de tipos; no hay tests deterministas para estas rutas).
- Build de Next en Windows (el pipeline de CSS de Next no corre en WSL).
- Auditoría de links sobre el HTML prerenderizado: cero `href` a rutas inexistentes.

## Progreso

### T1 · Detalle del servicio
- [ ] Pendiente

### T2 · Página de mascotas
- [ ] Pendiente

### T3 · Contacto y privacidad
- [ ] Pendiente

### T4 · Fixes finales
- [ ] Pendiente

## Ruta de ejecución
Delegated direct: un writer para los 4 tasks (toca 2+ archivos no triviales).
Verificación en el parent (types + build + auditoría de links).

## Commit de la unidad
- [ ] Pendiente

## Próximo paso
Implementar T1 → T4 con el writer delegado y verificar.
