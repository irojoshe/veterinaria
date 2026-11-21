# Layout público responsive — home (navbar, hero, secciones, CTA, footer)

## Objective

Alinear la home pública completa (navbar, hero, valores, servicios, pasos, contacto y footer) con el diseño de Figma (`pasta.figcraft`, frames "Inicio · Huella Vet" 1440px y "Móvil · Inicio público" 390px), corrigiendo tokens, estructura, proporciones móviles y CTAs.

## Problem

- `src/styles/globals.css` estaba desactualizado: faltaban tokens usados por los componentes.
- El navbar usaba alturas sin token, padding móvil de 80px y separaba los enlaces del CTA.
- El footer usaba un token inexistente y una estructura distinta.
- `tailwind-merge` v2 confundía los tamaños custom (`text-14`) con colores y borraba `text-bg-default`; el CTA quedaba con texto oscuro.
- Las secciones usaban `max-w-6xl` (1152px) en vez del contenido de 1280px de Figma, paddings móviles de 80px en vez de 40px, y CTAs sin ancho completo en móvil.

## Scope

- `src/styles/globals.css`: set completo de tokens de `files/globals.css` + `--color-primary-nav`, `--spacing-header-mobile`.
- `src/components/layout/Navbar/Navbar.tsx`, `MobileMenu.tsx`, `Footer.tsx`.
- `src/components/ui/CtaCita/`, `src/lib/utils/cn.ts`.
- `src/app/(public)/_components/HeroSection.tsx`, `ServiciosDestacados.tsx`, `PasosSection.tsx`, `ContactoSection.tsx`.

## Constraints

- Mobile-first: base 390px; `md:`/`lg:` para desktop 1440px.
- Contenido móvil con padding lateral exacto de 24px (`px-page-px`).
- CTAs de sección: `w-full` en móvil, `md:w-auto` en desktop.
- No introducir dependencias nuevas.
- Mantener accesibilidad (`aria-label`, `aria-current`, foco visible).
- No cambiar lógica de negocio ni copy fuera de lo indicado por Figma.

## Figma — medidas clave

### Home móvil (390px)
- Contenido: 342px = 390 − 24×2. Padding lateral 24px.
- Hero (415): padding 24; gap 24; H1 32px/110%/-1px; descripción 15px/145%; CTA 342×48; nota 12px; foto 342×330 radio 100; caption 12px.
- Valores (427): padding 24; gap 24; 3 filas de 342×46, gap 16, icono 26px.
- Servicios (446): padding 40/24; gap 24; header gap 14; cards 342×437 (foto 342×215, info padding 24 gap 14); CTA final 342×48.
- Pasos (545): padding 40/24; gap 24; header gap 14; pasos gap 24; número 26px/145% `#205C50`; título 18px/145% semibold `#243F39`; descripción 14px/145% `#64736B`.
- Contacto (561): padding 40/24; gap 24; foto 342×230 radio 14; datos 13px, columnas 161/161 gap 20; descripción 14px; CTA 342×48; WhatsApp link 13px semibold `#205C50`.
- Footer (591): 390×442; padding 24; columnas gap 18; fondo `#173F38`.

### Home desktop (1440px)
- Contenido: 1280px = 1440 − 80×2. Padding lateral 80px.
- Hero (3655): padding 48/80/64/80; gap 64; H1 52px; descripción 18px; acciones 355×48 gap 16; foto 620×540 radio 120.
- Valores (3674): padding 32/80; gap 48; 3 columnas 394.67px, gap 16, icono 30px.
- Servicios (3693): padding 80; gap 32; header 1280×101 gap 80; cards 1280 gap 24; CTA header 180×48.
- Pasos (3799): padding 80; gap 32; pasos 1280 gap 40; paso gap 12; número 32px; título 19px; descripción 14px.
- Contacto (3816): padding 64/80; gap 64; 2 columnas 608px; foto 608×230; datos 13px, columnas 294/294 gap 20; CTA 198×48.
- Footer (3849): 1440×338; padding 64; gap 28; 3 columnas 424 gap 20.

## Checklist

- [x] T1 — Tokens de diseño completos y coherentes con Figma.
- [x] T2 — Navbar desktop/móvil con banner, marca, enlaces y CTA alineados.
- [x] T3 — Componente `CtaCita` reutilizable con fondo `#205C50` y texto blanco.
- [x] T4 — Footer desktop/móvil con fondo `#173F38`, padding y columnas correctas.
- [x] T5 — Verificación: `npx tsc --noEmit` exit 0 (re-ejecutado por el orquestador); `npm run lint` roto pre-existente (ESLint 9 sin flat config); `npm run build` bloqueado por entorno WSL/Windows (sin binding `lightningcss-linux`).
- [x] T6 — Hero móvil: H1 32px, descripción 15px, gaps 24px, foto 342×330, CTA primario full width, secundario solo desktop.
- [x] T7 — Contenedores de Servicios/Pasos/Contacto: `max-w-content`, padding móvil 40/24, desktop 80.
- [x] T8 — CTAs de sección: `w-full md:w-auto`; Servicios con CTA móvil al pie y CTA desktop en el header.
- [x] T9 — Pasos: gaps 24/40, número 26/32px, título 18/19px, descripción 14px.
- [x] T10 — Contacto: foto móvil 342×230 radio 14, datos 13px en grid 161/161 gap 20, CTA full width, WhatsApp como link.
- [x] T11 — `npx tsc --noEmit` exit 0 al cierre.

### Pase 2 — secciones faltantes y assets

- [x] T12 — Assets: copiar fotos de Figma a `public/images/home/` y generar los 5 SVG en `public/icons/` (3 iconos de Valores + 2 flechas).
- [x] T13 — `ValoresSection`: reemplazar emojis por los SVG, `max-w-content`, padding 24/32, gap 24/48, icono 26/30px, título 16px `#243F39`, descripción 13px `#64736B`.
- [x] T14 — `LaClinicaSection`: fondo `#EEE8DC`, desktop 580×420 + texto 636, gap 64, padding 64/80; móvil 342×260, gap 24, padding 40/24; dos descripciones desktop y una móvil; CTA blanco 164×48 / full width móvil.
- [x] T15 — `CuidadosSection`: padding 80 desktop / 40/24 móvil, gap 32/24; header antetítulo + título 32px; 3 tarjetas 410.67×183 desktop (padding 28, gap 16) y apiladas móvil (padding 24, gap 12); etiqueta 12/13px, subtítulo 20/22px, descripción 14/15px; nota legal 12px responsive.
- [x] T16 — `ComunidadSection`: fondo blanco, padding 64/80 desktop y 40/24 móvil, gap 32/24; header desktop horizontal con CTA 180×48, móvil CTA al final; 3 tarjetas 410.67×363 desktop / 342×363 móvil, foto 290px radio 14, nombre 24px, descripción 14px, flecha 20px.
- [x] T17 — `InvitacionFinalSection`: desktop horizontal, gap 80, padding 80, título 32px en 2 líneas y CTA 184×48 con flecha; móvil vertical, gap 24, padding 40/24, CTA full width.
- [x] T18 — Reemplazar placeholders: Hero (`hero-desktop.jpg`/`hero-mobile.jpg`), tarjetas de Servicios (`servicio-consulta.png`, `servicio-vacunacion.jpg`, `servicio-preventiva.jpg`) y foto de Contacto (`contacto.jpg`).
- [x] T19 — Montar en `page.tsx` en el orden exacto: Hero → Valores → Servicios → La clínica → Cuidados → Comunidad → Pasos → Contacto → Invitación final (Footer queda en el layout).
- [x] T20 — Verificación: `npx tsc --noEmit` exit 0.

## Figma — secciones nuevas (pase 2)

### Valores
- Desktop (3674): 1440×110, fondo `#E9F0E8`, padding 32/80, gap 48; 3 columnas de 394.67×46, gap 16, icono 30px; título 16px semibold `#243F39`; descripción 13px `#64736B`.
- Móvil (427): 390×234, padding 24, gap 24; filas 342×46, icono 26px.

### La clínica
- Desktop (3738): 1440×548, fondo `#EEE8DC`, padding 64/80, gap 64; foto 580×420 radio 14; texto 636; antetítulo 12px bold `#205C50`; título 32px `#173F38`; descripciones 15px `#64736B`; CTA 164×48 blanco radio 8.
- Móvil (489): 390×616, padding 40/24, gap 24; foto 342×260; título 32px; descripción 15px; CTA 342×48.

### Cuidados cotidianos
- Desktop (3748): 1440×489, padding 80, gap 32; header 1280×65; 3 tarjetas 410.67×183, gap 24, padding 28, gap 16, radio 14; etiqueta 13px bold `#205C50`; subtítulo 22px `#243F39`; descripción 15px `#64736B`; nota 12px.
- Móvil (497): 390×796, padding 40/24, gap 24; header 342×100; tarjetas 342×158/187, padding 24, gap 12; etiqueta 12px; subtítulo 20px; descripción 14px.

### Nuestra comunidad
- Desktop (3766): 1440×624, fondo blanco, padding 64/80, gap 32; header 1280×101 con presentación 1020 y CTA 180×48; 3 tarjetas 410.67×363, gap 24; foto 290px radio 14; nombre 24px `#243F39`; descripción 14px `#64736B`; flecha 20px.
- Móvil (514): 390×1436, padding 40/24, gap 24; header 342×123; tarjetas 342×363; CTA 342×48 al final.

### Invitación final
- Desktop (3842): 1440×230, padding 80, gap 80; título 1016×70 en 2 líneas (32px `#173F38`); CTA 184×48 `#205C50` con flecha 20px.
- Móvil (586): 390×222, padding 40/24, gap 24; título 342×70; CTA 342×48.

## Acceptance criteria

- Home móvil usa 342px de contenido y 24px laterales en todas las secciones.
- Hero móvil: CTA 342×48, foto 342×330, H1 32px.
- Todos los CTAs de sección son full width en móvil y ancho automático en desktop.
- Servicios/Pasos/Contacto usan contenido de 1280px en desktop.
- Pasos y Contacto respetan tipografías y gaps de Figma.
- `npx tsc --noEmit` exit 0.

## Route

Pase 2: delegated direct — un writer para los 4 componentes nuevos y las actualizaciones de Valores/Servicios/Contacto/Hero/page. Assets preparados por el orquestador. Verificación: `npx tsc --noEmit`.

## Verification evidence

- `npx tsc --noEmit` → exit 0 (re-ejecutado por el orquestador al cerrar el pase).
- Worker `gentle-ai-worker` reportó `npx tsc --noEmit: exit 0` y ausencia de `text-base`/`text-label`/`max-w-6xl`/`py-page-h-xxl` en los archivos target.
- Inspección estructural: Hero `text-h2 lg:text-h1`, CTA primario `w-full md:w-auto`, secundario `hidden md:inline-flex`; Servicios `max-w-content`, `py-10 md:py-page-h-xl`, CTA móvil al pie; Pasos `gap-6 md:gap-10`, número `text-26 md:text-32`; Contacto grid 2 col con orden móvil, foto `h-hero-contact rounded-card`, datos `text-13` en grid 2 col.
- Pase 2: `npx tsc --noEmit` → exit 0 (worker y re-ejecución del orquestador).
- Pase 2: orden de `page.tsx` verificado: Hero → Valores → Servicios → La clínica → Cuidados → Comunidad → Pasos → Contacto → Invitación final.
- Pase 2: los 4 componentes nuevos existen; no quedan referencias a `hero-clinica.jpg`, "Imagen placeholder", `max-w-6xl` ni emojis en `ValoresSection`.
- Pase 2: assets presentes en `public/images/home/` (10 fotos) y `public/icons/` (5 SVG).
- Pase 2: sin verificación visual en navegador (no disponible en el entorno); paridad basada en specs de Figma. `/mascotas` sigue sin existir (link del CTA de Comunidad).
- Staged-tree verification: `npx tsc --noEmit` → exit 0 con 54 archivos staged (sin cita/admin/README/design source).
- Fix del menú móvil: `MobileMenu` cerrado ahora usa `invisible`, así el panel no se pinta sobre el banner/navbar.

## Progress

- [x] Exploración del repo y extracción de specs desde `pasta.figcraft`.
- [x] Tokens, navbar, footer, CtaCita y fix de `tailwind-merge`.
- [x] Home móvil/desktop (T6–T11) — aplicado por `gentle-ai-worker` y verificado con `npx tsc --noEmit` exit 0.
- [x] Pase 2 — assets copiados a `public/images/home/` y 5 SVG generados en `public/icons/`.
- [x] Pase 2 — T13–T19 implementados por `gentle-ai-worker` (Valores + 4 secciones + placeholders + orden), con ajustes finos del orquestador en La clínica, Hero y CTA final.
- [x] Pase 2 — T20 `npx tsc --noEmit` exit 0 (worker + re-ejecución del orquestador).
- [x] Commit de work unit `af42c08` en `feat/home-figma-alignment`: home + tokens + assets + fix del menú móvil.
- [x] PR: branch pusheada a `origin`; falta crear el PR desde la URL de GitHub (gh no instalado).
- [x] Revisión nativa: diferida por decisión del usuario hasta terminar la home; no se inicia START/consent para este candidato.
