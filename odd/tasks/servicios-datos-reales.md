# Servicios con datos reales de Supabase

## Objective

Reemplazar los datos simulados del catálogo de servicios por una lectura real de Supabase, con caché para la vista pública y sin caché para el panel de administración, aplicando las reglas de `docs/patterns/data-fetching.md`.

## Problem

- `getServiciosPublicos()` devolvía un array hardcodeado en `src/lib/services/servicios.ts` (6 servicios de ejemplo, `imagen_url: null`).
- `getServicios()` (admin) delegaba en `getServiciosPublicos()`, por lo que el panel nunca vio servicios reales.
- Las cards resolvían la foto con un mapa local de slugs (`IMAGENES` en `ServiciosDestacados.tsx` y `ServicioCard.tsx`), no con la columna `imagen_url` de la base.
- No existía `docs/patterns/`, ni convenciones documentadas de cliente/caché/columnas.

## Scope

- `docs/patterns/data-fetching.md` — documento de arquitectura (nuevo).
- `src/lib/supabase/server.ts` — `createSupabasePublicServerClient()` sin cookies.
- `src/lib/types/index.ts` — tipo `ServicioPublico`.
- `src/lib/services/servicios.ts` — `getServiciosPublicos()` (cacheada) y `getServicios()` (admin, sin caché).
- `src/app/(public)/_components/ServiciosDestacados.tsx`, `src/app/(public)/servicios/_components/ServicioCard.tsx` — imagen desde `servicio.imagen_url` con fallback.
- `src/app/(public)/cita/_components/CitaForm.tsx`, `SeccionPreferencias.tsx` — tipos alineados al catálogo público.
- `next.config.js` — `images.remotePatterns` para hosts externos.
- `public/images/placeholder-servicio.jpg` — fallback de imagen.

## Constraints

- Ninguna consulta dentro de bucles ni funciones recursivas: una query lineal por función.
- La función cacheada no puede leer cookies (`cookies()` dentro de `unstable_cache` lanza error en Next 16).
- La columna `publicado` solo se usa como filtro en la lectura pública; el admin la selecciona porque su UI la consume.
- Sin `SELECT *`: exactamente las columnas que la UI necesita.
- Componentes nuevos o modificados por debajo de 150 líneas.

## Checklist

- [x] T1 — Documento de arquitectura `docs/patterns/data-fetching.md` con las tres reglas de oro.
- [x] T2 — `createSupabasePublicServerClient()` sin cookies en `src/lib/supabase/server.ts`.
- [x] T3 — Tipo `ServicioPublico` (7 columnas, sin `publicado`).
- [x] T4 — `getServiciosPublicos()` con `unstable_cache`, cliente público, `.eq('publicado', true)`, 7 columnas, try/catch → `[]`.
- [x] T5 — `getServicios()` (admin) con cliente con cookies, sin caché, sin filtro de `publicado`.
- [x] T6 — Cards sin mapa `IMAGENES`: imagen desde `servicio.imagen_url` con fallback `/images/placeholder-servicio.jpg`.
- [x] T7 — Tipos del flujo de cita alineados con `ServicioPublico`.
- [x] T8 — `next.config.js` con `images.remotePatterns` para las URLs externas de la DB.
- [x] T9 — Verificación: `npx tsc --noEmit` exit 0.

## Acceptance criteria

- La página de Servicios y la home leen servicios de Supabase (no datos hardcodeados).
- La lectura pública está cacheada y filtra `publicado = true`.
- La lectura del admin no está cacheada y trae también `publicado` (columna que consume su UI).
- Las cards muestran la imagen de `imagen_url` y caen al placeholder cuando es `null`.
- Un fallo de Supabase devuelve `[]` sin romper el render.
- `npx tsc --noEmit` exit 0.

## Route

Direct inline. Un solo archivo de lógica de datos (`servicios.ts`) y ajustes mecánicos de tipo/UI en el resto; la evidencia está acotada (grep de consumidores + `next.config.js`), sin necesidad de exploración adicional ni delegación.

## Verification evidence

- Consumidores de `servicio.slug` / `servicio.duracion_minutos`: `cita/_components/SeccionPreferencias.tsx:33-34`, `servicios/_components/ServicioCard.tsx:38,46`, `_components/ServiciosDestacados.tsx:90,97`.
- Consumidores de `servicio.publicado` (solo admin): `admin/servicios/page.tsx:9`, `admin/servicios/_components/ServicioTableRow.tsx:30-31`, `admin/servicios/_components/FormServicio.tsx:68`.
- `cookies()` dentro de `unstable_cache` lanza error: `node_modules/next/dist/server/request/headers.js:45-46`.
- `next.config.js` sin `images.remotePatterns` → `next/image` falla con URLs externas.
- Query validada contra la base real: 3 filas publicadas (`Consulta General`, `Medicina Preventiva`, `Vacunación`), `precio` numérico, `imagen_url` con host externo `loremflickr.com`.
- `npx tsc --noEmit` → exit 0 sobre el working tree y sobre el árbol staged (verificado en un worktree temporal, sin tocar el working tree).
- Sin verificación visual en navegador: el pipeline de CSS de Next no corre en WSL por falta del binding nativo `lightningcss-linux-x64-gnu` (solo está el de Windows). Limitación del entorno, no del código.

## Progress

- [x] T1 — Documento de arquitectura creado.
- [x] T2–T8 — Implementación.
- [x] T9 — Verificación y commit `8ce773f` (`feat(servicios): implementa logica real de Supabase con cache y cliente publico`), pusheado a `origin/feat/home-figma-alignment`.
- [ ] Pendiente del usuario: build en Windows (`npm run build`) para confirmar el render con las imágenes externas.
