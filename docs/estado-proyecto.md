# Estado del proyecto

Punto de control para retomar el trabajo sin perder contexto. **Actualizado: 17 de noviembre de 2026.**

## Dónde estamos

| Dato | Valor |
| --- | --- |
| Rama activa | `feat/home-servicios-supabase` |
| Rama base | `main` (`origin/main`) |
| Último commit | `feat(servicios): implementa logica real de Supabase con cache y cliente publico` |
| PR | Pendiente de apertura por el mantenedor: rama `feat/home-servicios-supabase` → `main` |
| Verificación | `npx tsc --noEmit` → exit 0; `npm run build` en Windows → OK (11/11 rutas generadas) |

## Fases completadas

| Fase | Resultado | Seguimiento |
| --- | --- | --- |
| Tokens y layout base | Tokens de Figma, navbar, footer, `CtaCita`, fix de `tailwind-merge` | `odd/tasks/layout-publico-responsive.md` |
| Home pública | 4 secciones nuevas (La clínica, Cuidados, Comunidad, Invitación final), Valores con SVG, fotos reales, orden exacto de secciones | `odd/tasks/layout-publico-responsive.md` |
| Fix de navegación | El menú móvil cerrado ya no se pinta sobre el navbar (`invisible` en `MobileMenu`) | commit en `feat/home-figma-alignment` |
| Datos reales del catálogo | `getServiciosPublicos()` cacheado con cliente público, `getServicios()` sin caché para el panel, cards con `imagen_url` de la DB | `odd/tasks/servicios-datos-reales.md` |
| Convenciones | Formato de ramas y commits documentado | `docs/git-convenciones.md` |

## Decisiones de arquitectura vigentes

- **Dos clientes Supabase**: con cookies (`createSupabaseServerClient`) para sesión y rutas privadas; sin cookies (`createSupabasePublicServerClient`) para lecturas públicas cacheadas. Detalle y motivo en `docs/patterns/data-fetching.md`.
- **Caché solo donde corresponde**: el catálogo público usa `unstable_cache` (revalidate 5 min); el panel de administración lee en cada request.
- **Columnas exactas**: nada de `SELECT *`; cada lectura pide las columnas que su UI consume.
- **Imágenes de servicios**: salen de la columna `imagen_url` de la base (host externo `loremflickr.com`, permitido en `next.config.js`), con `/images/placeholder-servicio.jpg` como fallback.

## Pendientes

| Pendiente | Detalle | Prioridad |
| --- | --- | --- |
| Abrir el PR | Rama `feat/home-servicios-supabase` → `main` | Alta |
| `/mascotas` | El CTA "Conocer mascotas ↗" de la sección Comunidad apunta a una ruta inexistente (404) | Alta |
| Revisión nativa | Revisión de gentle-ai diferida hasta cerrar la home (decisión del mantenedor) | Media |
| Ruido en el build | Las rutas `/admin/*` registran `Dynamic server usage` durante el prerender; se silencia con `export const dynamic = 'force-dynamic'` en `src/app/admin/layout.tsx` | Baja |
| Auditoría de dependencias | `npm audit` reporta 8 vulnerabilidades (7 moderadas, 1 alta). Revisar sin aplicar `audit fix --force` a ciegas | Media |
| Reconstrucción del panel | `upsertServicio` y `deleteServicio` siguen siendo mocks (`src/lib/services/servicios.ts`) | Media |

## Notas de entorno

- En WSL el proyecto no puede ejecutar el pipeline de CSS de Next: solo están los bindings nativos de Windows (`lightningcss`, `sharp`, `@next/swc`). El build y el render se validan en Windows.
- Con Next 16, `cookies()` dentro de `unstable_cache` lanza error; por eso la lectura cacheada usa el cliente sin cookies.

## Cómo retomar

1. `git switch feat/home-servicios-supabase`
2. Leer `docs/estado-proyecto.md` y el documento ODD de la fase activa en `odd/tasks/`.
3. Verificar el estado con `git status` y `npx tsc --noEmit`.
