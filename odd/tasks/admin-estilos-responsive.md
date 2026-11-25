# Estilos del panel admin: imagen de login, body resize y responsive móvil

## Objetivo
Que el panel de administración de "Huella Vet" se vea y funcione como el diseño, tenga la
imagen real del login y sea usable en proporciones de teléfono.

## Problema
1. `/admin/login` referencia `/images/admin-login.jpg`, que **no existía** → la imagen del
   panel de bienvenida salía rota.
2. El "body" del panel admin no tiene la propiedad `resize`: no se puede redimensionar ni
   ver sus límites; el contenido define la altura y el scroll ocurre en el documento.
3. En proporciones de teléfono el panel **no tiene navegación**: el sidebar es
   `hidden md:flex` y no existe ningún disparador alternativo. Además:
   - el padding de las páginas es `px-9 py-9` (36px) en móvil, donde debería ser ~16px;
   - las tablas usan `grid-cols-6` sin scroll horizontal → se rompen en pantalla angosta;
   - la barra de administración y el pie tienen `px-9` fijo.

## Por qué
El diseño de referencia (`pasta.figcraft`, frame "Administración · Iniciar sesión" #2694 y
"Administración · Resumen" #2526) define sidebar de 228px + área de trabajo de 1132px con
barra de 80px. La implementación actual no replica ese frame en móvil y además depende de
un asset inexistente. Un panel que en un teléfono no tiene menú es un panel inaccesible.

## Fuente de verdad: Figma
Archivo: `C:\Users\Iro\Downloads\pasta.figcraft` (Figma renombrado; es un ZIP con
`document.json` + `images/`). Se descomprime con Python `zipfile` (no hay `unzip` en WSL).

- Frame de login: `#2694` "Administración · Iniciar sesión" (1360×1000).
  - `#2695` "Bienvenida de administración" (650×1000) → columna izquierda.
  - `#2701` "Fotografía" (554×530) → imagen con fill `image/07485b53...` (JPEG 1024×1024).
  - `#2704` "Acceso privado" (710×947) → columna derecha con el formulario.
- Frame del panel: `#2526` "Administración · Resumen" (1360×1376).
  - `#2527` "Navegación administrativa" (228px) · `#2570` "Área de trabajo" (1132px)
    → `#2571` "Barra de administración" (80px) → `#2579` "Contenido" (1296px).
- No existe frame de administración en móvil en el archivo: las proporciones de teléfono
  se derivan del frame desktop aplicando el patrón mobile-first del repo.

## Alcance

### T1 · Imagen del login
- Extraer `images/07485b5304759fd8e65898c8973125d875df3120a1fa372bce883b3ae83d2312`
  (JPEG 1024×1024) del `.figcraft` a `public/images/admin-login.jpg`.
- La page del login ya la referencia: no cambia código.

### T2 · Body resize en el panel
- En `src/app/admin/(panel)/layout.tsx`, el contenedor raíz del panel pasa a ser un cuerpo
  redimensionable: `resize-y overflow-auto` (propiedad CSS `resize: vertical`).
  - El `resize` solo es funcional con `overflow` distinto de `visible` → por eso `overflow-auto`.
  - `min-h-screen` se mantiene como piso de altura.
  - El área de trabajo sigue con scroll propio (`flex-1 min-h-0 overflow-y-auto`).

### T3 · Navegación móvil
- Nuevo `src/components/layout/AdminSidebar/navItems.tsx`: configuración compartida de
  los módulos (href, label, icono), usada por el sidebar de escritorio y por el drawer.
- `src/components/layout/AdminSidebar/AdminSidebar.tsx`: consume la configuración compartida.
- Nuevo `src/components/layout/AdminTopbar/AdminMobileMenu.tsx` (client): disparador
  (hamburguesa) + drawer lateral con los módulos.
  - Drawer con overlay, cierre por click fuera, por tecla Escape y al navegar.
  - Accesibilidad: `aria-expanded`, `aria-controls`, `aria-label`, foco al abrir.
  - El botón va en la barra superior, visible solo en móvil (`md:hidden`).
- `src/components/layout/AdminTopbar/AdminTopbar.tsx`: padding responsive y hueco para el
  disparador del menú.

### T4 · Responsive del contenido
- Padding responsive en las 4 páginas del panel: `px-4 py-6 md:px-9 md:py-9`.
- Pie del panel: `px-4 md:px-9`.
- Tablas (`TablaCitasHoy`, `TablaCitas`, `TablaMascotas`, `TablaServicios`): wrapper con
  `overflow-x-auto` y ancho mínimo en la grilla interna, para que las columnas no se
  aplasten en pantalla angosta.
- Formularios (`FormMascota`, `FormServicio`): `grid-cols-2` → `grid-cols-1 sm:grid-cols-2`.
- Modales (`DetalleCitaModal`, `DeleteModal`): ancho y padding adaptables a móvil.

## Restricciones
- Quality Gate: ningún archivo toca 150 líneas.
- Solo clases de Tailwind ya disponibles: sin dependencias nuevas, sin CSS global nuevo.
- Artefactos técnicos en inglés; copy de UI en español.
- No tocar la lógica de negocio, las queries ni el CRUD del panel.
- No tocar el sitio público (`src/app/(public)/`) ni `src/proxy.ts`.
- El botón "Cerrar sesión" sigue sin functionality real (preexistente): queda como
  follow-up, no se implementa aquí.
- `npm run lint` no se ejecuta (ESLint 9 sin flat config, roto de forma preexistente).
- No levantar `next dev` en WSL: el binding nativo de Linux de lightningcss provoca
  SIGBUS (`node: next-server ... fatal signal 7`) y tumba el server.

## Criterios de aceptación
- [ ] `public/images/admin-login.jpg` existe y es el JPEG del frame de login del Figma.
- [ ] `npx tsc --noEmit` sale con código 0.
- [ ] El contenedor raíz del panel tiene la propiedad `resize` (clase `resize-y`) y
      `overflow` distinto de `visible`.
- [ ] En anchos < 768px hay un disparador de menú visible que abre el drawer con los 8
      módulos del panel.
- [ ] El drawer se cierra con Escape, con click en el overlay y al navegar.
- [ ] Las 4 páginas del panel usan padding de 16px en móvil y 36px desde `md`.
- [ ] Las tablas tienen scroll horizontal en móvil sin deformar la grilla.
- [ ] Ningún archivo del área tocada supera 150 líneas.

## Checks aplicables
- `npx tsc --noEmit` (runner de tipos; no hay tests deterministas para estilos).
- Lectura estructural de los archivos tocados: clases aplicadas y límites de línea.

## Progreso

### T1 · Imagen del login
- [x] `images/07485b53...` (JPEG 1024×1024) extraído del `.figcraft` a
      `public/images/admin-login.jpg`.

### T2 · Body resize
- [x] `resize-y overflow-auto` en el contenedor raíz del panel + `min-h-0` en `<main>`.

### T3 · Navegación móvil
- [x] `navItems.tsx` compartido (configuración de los 8 módulos, sin `'use client'`).
- [x] `AdminMobileMenu.tsx`: disparador + drawer accesible (148 líneas).
- [x] Sidebar consume la configuración compartida; `AdminSidebarFooter` exportado con
      `onNavigate` opcional; el topbar sigue siendo server component e incluye el disparador.

### T4 · Responsive del contenido
- [x] Padding responsive en las 4 páginas (`px-4 py-6 md:px-9 md:py-9`) y en el pie.
- [x] Scroll horizontal en las 4 tablas (`overflow-x-auto` + `min-w-[900px|800px|760px]`
      aplicado al encabezado y a las filas, para que no se separen).
- [x] Formularios `grid-cols-1 sm:grid-cols-2`; modales con ancho y padding de teléfono.

## Ruta de ejecución
Delegated direct: un writer para T2+T3+T4 (5+ archivos no triviales: layout del panel,
topbar, sidebar, configuración compartida, nuevo drawer, tablas, formularios y modales).
El parent verifica tipos y estructura.

## Verificación
- `npx tsc --noEmit`: exit 0 (ejecutado por el writer y repetido por el parent).
- Tokens de Tailwind usados por el drawer comprobados contra `src/styles/globals.css`:
  `--color-background-warm`, `--shadow-panel`, `--color-primary-nav` y `--color-border-muted`
  existen. Ninguna clase inventada.
- Archivos tocados: 18. Máximo: `AdminMobileMenu.tsx` con 148 líneas (límite 150).
- Sin verificación visual en runtime: `next dev` y `build` están prohibidos en WSL por el
  crash nativo de lightningcss (SIGBUS). La comprobación visual queda en Windows.

## Próximo paso
Comprobar en Windows (`npm run dev`) el login con la imagen nueva, el drag de resize del
body del panel y el drawer en anchos < 768px.

Pendiente conocido: el botón "Cerrar sesión" sigue sin functionality real (preexistente);
las rutas del sidebar `/admin/clientes`, `/admin/negocio`, `/admin/notificaciones` y
`/admin/operacion` siguen sin existir.
