# Fix: loop de render en `/admin/login`

## Objetivo
Que `/admin/login` renderice el formulario de acceso una sola vez y que el panel protegido
(`/admin/**`) siga exigiendo sesión, sin re-renderizados ni peticiones encadenadas.

## Problema
`src/app/admin/layout.tsx` es el layout de **todas** las rutas bajo `/admin/**`, incluido
`/admin/login`. Su guarda `redirect('/admin/login')` se ejecutaba al renderizar el propio
login sin sesión: un auto-redireccionamiento a la misma URL.

Consecuencias observadas:
- El layout aborta el render antes de que la página llegue a renderizarse → el formulario
  nunca aparece.
- El client router de Next sigue el redirect indefinidamente → cientos de
  `GET /admin/login 200` en el log de `npm run dev`.
- El login nunca es accesible, así que tampoco se puede iniciar sesión.

Error de diseño de origen: `src/app/admin/login/layout.tsx` comentaba *"Sobreescribe el layout
de /admin para esta ruta"*. En App Router los layouts anidados **se componen**, no se
sobreescriben (docs oficiales Next 16.4.5: *"Layouts at any level wrap their child segments"*).

Problema secundario detectado: `src/proxy.ts` devuelve `NextResponse.redirect(...)` descartando
el `response` que accumulate las cookies refrescadas por Supabase en `setAll`. Las cookies
nuevas se perdían en cada redirect.

## Por qué
Un panel de administración que no deja entrar es un bloqueante total: sin login no hay
gestión, y el síntoma (peticiones infinitas) hace pensar en un problema de caché cuando en
realidad es un problema de composición de layouts.

## Alcance

### T1 · Route group `(panel)`
- Crear `src/app/admin/(panel)/`.
- Mover con `git mv` (historial preservado): `layout.tsx`, `page.tsx`, `_components/`,
  `citas/`, `mascotas/`, `servicios/`.
- El layout de protección (guarda `getSession()` + `redirect('/admin/login')` + Sidebar +
  Topbar) pasa a ser `src/app/admin/(panel)/layout.tsx`.
- Las URLs no cambian: los route groups no forman parte del path.

### T2 · Login fuera del layout autenticado
- Eliminar `src/app/admin/login/layout.tsx` (el que supuestamente sobreescribía al padre).
- Inlinear su wrapper visual (`min-h-screen bg-background flex`) en
  `src/app/admin/login/page.tsx` para no perder el layout de dos columnas.
- `src/app/admin/login/page.tsx` queda sin guarda de sesión del panel; conserva su propio
  check `getSession()` → `redirect('/admin')` para usuarios ya autenticados.

### T3 · Proxy
- `src/proxy.ts` queda con una sola responsabilidad: proteger `/admin/**` (excepto
  `/admin/login`) redirigiendo a `/admin/login` cuando no hay usuario.
- Se elimina el redirect login→admin del proxy (queda en la page del login): evita que
  el proxy y la page compitan por la misma decisión.
- Los redirects del proxy ahora preservan las cookies refrescadas por Supabase
  (`response.cookies` → respuesta de redirect).

### T4 · Verificación de rutas
- Las importaciones internas del árbol admin son relativas y se mueven juntas → siguen
  válidas. Las únicas importaciones externas son alias `@/` (componentes y lib) → no cambian.
- Ningún archivo fuera del árbol admin importa rutas `app/admin/**` (verificado por grep).
- Precedente ya presente en el repo: `src/app/(public)/`.

## Restricciones
- Quality Gate: ningún archivo nuevo supera 150 líneas.
- No tocar `next.config.js` (CommonJS + CRLF) salvo necesidad imperativa (no hace falta).
- No tocar la lógica de negocio ni el CRUD del panel: este task es solo de rutas y auth.
- Artefactos técnicos en inglés; copy de UI en español.
- `npm run lint` no se ejecuta (ESLint 9 sin flat config, roto de forma preexistente).

## Criterios de aceptación
- [ ] `npx tsc --noEmit` sale con código 0.
- [ ] `/admin/login` sin sesión responde 200 y renderiza el formulario (sin bucle).
- [ ] `/admin` sin sesión responde redirect a `/admin/login` (una sola vez).
- [ ] `/admin` con sesión renderiza el panel con Sidebar y Topbar.
- [ ] El build lista `/admin`, `/admin/citas`, `/admin/mascotas`, `/admin/servicios` y
      `/admin/login` con las mismas URLs que antes del cambio.

## Checks aplicables
- `npx tsc --noEmit` (runner de tipos; no hay tests deterministas para este flujo).
- `npm run build` (WSL): confirma el árbol de rutas tras el route group.
- Smoke test HTTP sobre el dev server: `GET /admin/login` → 200, `GET /admin` → 307 a
  `/admin/login`, sin cadena de peticiones.

## Progreso

### T1 · Route group `(panel)`
- [x] Árbol admin movido a `src/app/admin/(panel)/` (29 archivos, renames al 100% en git).

### T2 · Login fuera del layout autenticado
- [x] `src/app/admin/login/layout.tsx` eliminado; su shell visual (`min-h-screen bg-background flex`)
      inlineado en `src/app/admin/login/page.tsx` para conservar las dos columnas.

### T3 · Proxy
- [x] Protección única de `/admin/**` (excepto `/admin/login`).
- [x] Redirect login→admin eliminado del proxy (queda en la page del login).
- [x] Los redirects del proxy preservan las cookies refrescadas por Supabase.

### T4 · Verificación
- [x] `npx tsc --noEmit` → exit 0.
- [ ] Build + smoke test HTTP → pendiente en Windows (ver abajo).

## Ruta de ejecución
Direct inline: refactor estructural mecánico (`git mv`) sobre archivos ya leídos y
entendidos + 2 ediciones puntuales (`proxy.ts`, `login/page.tsx`). Sin research pendiente,
sin decisiones de producto abiertas, sin diseño sin resolver. La verificación de rutas se
hace en el parent.

## Verificación
- `npx tsc --noEmit`: exit 0.
- Estructura: la guarda de sesión ya no pertenece al árbol de la ruta `/admin/login`
  (vive en `src/app/admin/(panel)/layout.tsx`), así que el auto-redirect a la misma URL
  queda eliminado por construcción.
- Smoke test HTTP: no se pudo ejecutar en WSL. `node_modules` es compartido con Windows y
  quedó solo con el binding nativo `lightningcss-win32-x64-msvc`; `next dev` en WSL muere
  con SIGBUS (`node: next-server ... fatal signal 7`) al compilar. Se restauró
  `lightningcss-linux-x64-gnu@1.33.0` con `npm pack` + extracción manual (sin
  `npm install`, para no borrar el binding de Windows), pero el smoke test quedó pendiente
  a petición del usuario.

## Próximo paso
Validar en Windows (`npm run dev`): `/admin/login` debe responder 200 y renderizar el
formulario a la primera, sin cadena de peticiones; `/admin` debe redirigir a `/admin/login`.

Pendiente conocido (fuera del alcance de este task): el sidebar enlaza a
`/admin/clientes`, `/admin/negocio`, `/admin/notificaciones` y `/admin/operacion`, y esas
rutas no existen (404). También falta `public/images/admin-login.jpg`.
