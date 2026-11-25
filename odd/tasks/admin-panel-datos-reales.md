# Panel de administración con datos reales de Supabase

## Objetivo
Que el panel de administración de "Huella Vet" deje de mostrar mocks y lea/escriba la base
de datos real (`servicios`, `mascotas`, `citas`, `clientes`), con los tipos alineados al
esquema real y `try/catch` en todos los casos.

Incluye el ajuste de UI/UX detectado en el mismo bloque: sin scroll horizontal en el body,
shell del panel y del login con `h-screen overflow-hidden`, aviso de acceso denegado en color
de peligro real y proporciones correctas de teléfono en el login.

## Problema
1. **Lecturas mockeadas**: `getMascotas()`, `getCitas()`, `getCitaById()`, `getCitasHoy()` y
   `getResumenEstadisticas()` devuelven arrays estáticos; el dashboard muestra números fijos.
2. **Escrituras mockeadas**: `upsertServicio`, `deleteServicio`, `upsertMascota`,
   `deleteMascota` y `updateEstadoCita` solo hacen `console.log` y devuelven `success: true`.
3. **Tipos desalineados del esquema**: `Mascota.publica` (real: `publicado`), `Mascota.propietario`
   y `Mascota.slug` (no existen), `Cita.referencia` (no existe), `Cita.fecha_preferida` /
   `Cita.hora_preferida` (real: `fecha` / `hora`), `Cita.servicio_nombre` (requiere join).
4. **Imagen de servicio descartada**: la query sí trae `imagen_url`, pero
   `ServicioTableRow` renderiza un placeholder vacío; además `guardarServicio` fuerza
   `imagen_url: null` al guardar.
5. **Caché pública sin invalidar**: las acciones revalidan paths, pero no invalidan los tags
   `servicios` / `mascotas` de `unstable_cache`.
6. **UI/UX**: el body scrollea horizontalmente; el `resize-y` del panel hace que la página
   "se mueva más allá de los límites"; el login no tiene patrón de teléfono robusto y su
   aviso de acceso denegado usa `bg-accent-amber-light`, clase que **no existe** en el theme
   (`@theme` solo define `--color-bg-warning: #faf0da` y `--color-status-pending-bg: #faf0da`).

## Por qué
El usuario va a cargar datos reales en la base. Si el panel sigue leyendo mocks, la
administración opera sobre información ficticia y las escrituras no llegan a la DB. Además,
un panel que no scrollea bien en teléfono y muestra avisos de error en un color que no existe
en el design system rompe la confianza en la herramienta.

## Esquema real (verificado contra PostgREST, 2026-11-21)

| Tabla | Columnas |
|---|---|
| `servicios` | id, nombre, descripcion, precio, duracion_minutos, imagen_url, imagekit_file_id, publicado (default false), created_at, updated_at, slug |
| `mascotas` | id, nombre, especie, raza, sexo, fecha_nacimiento, foto_url, imagekit_file_id, publicado (default false), created_at, updated_at, precio, historia, estado_adopcion, vacunado, esterilizado, microchip, compatible_ninos, compatible_mascotas |
| `citas` | id, servicio_id, mascota_id, propietario_nombre, propietario_telefono, propietario_email, mascota_nombre, mascota_especie, fecha, hora, motivo, estado (default 'pendiente'), created_at, updated_at |
| `clientes` | email, nombre, telefono, total_citas, ultima_cita (sin `id`) |
| `negocio` | id, nombre, descripcion, direccion, telefono, email, whatsapp, horario, mapa_url, logo_url, imagekit_file_id, created_at, updated_at |

Datos actuales: `servicios` 7, `mascotas` 8, `citas` 0, `clientes` 0, `negocio` 1.
FKs confirmadas: `citas.servicio_id → servicios.id`, `citas.mascota_id → mascotas.id`
(los embeds `servicios(nombre)` y `mascotas(id,nombre)` responden sin error).
Única RPC disponible: `is_admin` (no hay RPC de agregados).

## Decisiones de diseño
- **Agregación en JS**: sin RPC de agregados, `getResumenEstadisticas` hace 4 queries
  lineales con proyección mínima y calcula los contadores en memoria:
  `citas(select=estado,fecha, desde el inicio del mes)`, `servicios(select=id,publicado)`,
  `mascotas(select=id,publicado)`, `clientes(count exact)`.
  La distribución de estados y "citas del mes" son del mes en curso (la UI ya rotulaba
  "noviembre" fijo).
- **`referencia` derivada**: la DB no la tiene; la Fase 1 la expone como helper puro
  `getCitaReference(id)` = los primeros 8 caracteres del id en mayúsculas, sin prefijo.
- **`servicios?.nombre` por join**: `select='..., servicios(nombre)'` con el embed de PostgREST;
  la interfaz `Cita` expone `servicios?: { nombre: string }`.
- **`Mascota.propietario` se elimina**: la tabla `mascotas` no tiene dueño; la columna
  "Propietario" sale de la tabla admin y del formulario.
- **Color de peligro**: se usan los tokens existentes del proyecto
  (`--color-status-cancelled-bg: #f9ebe7`, `--color-status-cancelled: #a34539`) en lugar de
  `bg-red-50` crudo, para no romper el design system.

## Alcance

### T1 · UI/UX del shell (inline)
- `src/app/layout.tsx`: `<body className="overflow-x-hidden">`.
- `src/app/admin/(panel)/layout.tsx`: raíz `flex h-screen overflow-hidden bg-background`
  (se elimina `resize-y overflow-auto`, que provocaba el desplazamiento fuera de los límites);
  columna de trabajo `min-h-0`; `<main>` conserva `flex-1 min-h-0 overflow-y-auto`.
- `src/components/layout/AdminSidebar/AdminSidebar.tsx`: sidebar `h-full overflow-y-auto`
  (sin `min-h-screen sticky top-0 h-screen`).
- `src/app/admin/login/page.tsx`: shell `h-screen overflow-hidden`; columna izquierda
  `h-full`; columna derecha `flex-1 min-w-0 overflow-y-auto` con envoltorio
  `min-h-full flex flex-col justify-center` (patrón que no recorta el contenido al exceder
  el alto); padding de teléfono `px-6 md:px-9`.
- Aviso "Acceso no autorizado o sesión expirada": de `bg-accent-amber-light` (clase
  inexistente) a `bg-status-cancelled-bg border border-status-cancelled/20`, con el título en
  `text-status-cancelled` y el icono de aviso.

### T2 · Tipos alineados al esquema (`src/lib/types/index.ts`) — COMPLETADA (Fase 1)
- `Mascota`: `publicado` en lugar de `publica`; sin `propietario` ni `slug`; agregados
  `precio`, `historia`, `estado_adopcion`, `vacunado`, `esterilizado`, `microchip`,
  `compatible_ninos`, `compatible_mascotas`.
- `Cita`: `fecha` y `hora` en lugar de `fecha_preferida` y `hora_preferida`; `servicios?: { nombre: string }`
  (join) en lugar de `servicio_nombre`; sin `referencia`.
- `Servicio`: `imagekit_file_id: string | null` (y se agregó la columna a las proyecciones
  explícitas de los SELECT para que el tipo no mienta sobre el runtime).
- `Notificacion` y `Cliente`: interfaces nuevas alineadas con el esquema real.
- `ResumenEstadisticas`: exactamente 4 campos (`totalCitas`, `citasPendientes`,
  `totalMascotas`, `totalServicios`).
- `ResumenDashboard extends ResumenEstadisticas`: conserva el shape rico que leen los
  widgets actuales del dashboard (`citas_hoy`, `distribucion`, `clientes_total`, ...), para
  no romperlos en esta fase ni inventar datos.
- Helpers puros en el mismo archivo: `formatCitaDate` (parseo local, sin corrimiento UTC),
  `formatCitaTime` ('HH:MM'), `getCitaReference` (8 chars del id).

### T3 · Lecturas reales — COMPLETADA (Fase 2)
- Cliente con cookies (`createSupabaseServerClient()`), sin caché y sin cliente público.
- `getCitas()`: proyección explícita + embed `servicios(nombre)`, orden `fecha desc, hora desc`.
- `getCitaById()`: misma proyección con `.maybeSingle()`.
- `getMascotas()`: admin sin filtro de `publicado`, orden por nombre.
- `getCitasHoy()`: filtro de DB `fecha=eq.now()` (CURRENT_DATE de Postgres), orden `hora asc`.
- `getResumenEstadisticas()`: 6 queries lineales con `.count` de Supabase (citas total, citas
  pendientes, window mensual, servicios, mascotas, clientes) + agregación en JS de la
  distribución. Fallback: todos los contadores en 0.
- `getClientes()` (nuevo): consulta la vista `clientes`.
- `getNotificaciones()` (nuevo): embed `citas(mascota_nombre, propietario_nombre)`.
- **Normalización de estados**: la DB mezcló convenciones (`pending`/`pendiente`,
  `confirmed`/`confirmada`, `completed`/`completada`/`atendida`, `canceled`/`cancelada`).
  El servicio mapea todas las variantes a `EstadoCita`; un valor desconocido cae en
  `pendiente` con `console.warn`. No se modificó la base.

### T4 · Escrituras reales — COMPLETADA (Fase 3)
- `upsertServicio`: INSERT/UPDATE real con cliente de cookies. En UPDATE se omite `slug`
  (se preserva); en INSERT se genera con slugify del nombre (el sitio público busca por slug,
  así que un servicio sin slug es invisible).
- `upsertMascota`: INSERT/UPDATE real con las 15 columnas; `imagekit_file_id` se preserva.
- `deleteServicio` / `deleteMascota`: DELETE real. Error de FK `23503` (hay citas que los
  referencian) → mensaje en español y nunca `success: true`.
- `updateEstadoCita`: UPDATE real de `citas.estado` con el valor canónico en español.
- Server actions (`servicios`, `mascotas`, `citas`): verificación de sesión con `getSession()`,
  validación Zod, llamada a la service y, sólo en caso de éxito, `updateTag('servicios'|'mascotas')`
  + `revalidatePath` de las rutas admin y públicas. `updateTag` vive únicamente en los
  archivos `'use server'` (en una service function tiraría error).
- Los formularios y el modal de borrado muestran `state.error`.

### T5 · UI admin con datos reales — COMPLETADA (Fases 2 y 3)
- `ServicioTableRow` renderiza `imagen_url` con `next/image` y placeholder si es null (Fase 3).
- `MascotaTableRow` idem con `foto_url` y `/images/placeholder-mascota.jpg` (Fase 3).
- `FormServicio` / `FormMascota`: input de URL de imagen opcional, prellenado y validado;
  se eliminó el `null` forzado (Fase 3).
- `MascotaTableRow`, `FormMascota`, `TablaMascotas`: `publicado` y sin columna Propietario (Fase 1).
- `FilaCita`, `DetalleCitaModal`, `TablaCitasHoy`: `fecha`, `hora`, `servicios?.nombre` (Fase 1).
- `AlertaPendientes`: usa la cita pendiente real de hoy (Fase 2).
- `ResumenCitas`: etiqueta de mes dinámica (Fase 2).
- `(panel)/page.tsx`: fecha real del día (Fase 2).
- Avisos de "datos de ejemplo" eliminados de `citas/page.tsx`, `mascotas/page.tsx` y del pie (Fase 2).

### T6 · Vistas faltantes del panel — COMPLETADA (Fase 4)
El sidebar enlazaba `/admin/clientes`, `/admin/negocio` y `/admin/notificaciones`, que no
existían (404). Se crearon las tres:
- `clientes/page.tsx`: servidor con 2 queries lineales (`getClientes()` + `getCitas()`, sin N+1).
  `TablaClientes` con buscador local (nombre/email/teléfono), contador de resultados y tabla
  responsive. `DetalleClienteModal` con los datos del cliente y su historial de citas
  (filtrado por `propietario_email`), foco inicial, cierre por Escape/overlay y estado vacío.
- `notificaciones/page.tsx`: servidor con `getNotificaciones()`. `TablaNotificaciones` con
  filtro por estado derivado de los estados DISTINTOS presentes en los datos (con conteo),
  columna de error sólo cuando hay alguna notificación con error, y parseo local del
  `created_at`.
- `negocio/page.tsx` + `negocio/actions.ts` + `FormNegocio`: formulario con los 8 campos
  editables de la clínica. La action `actualizarNegocio` valida sesión + Zod y, sólo en caso
  de éxito, hace `updateTag('negocio')` + `revalidatePath` de `/admin/negocio`, `/`,
  `/contacto`, `/mascotas` y `/privacidad` (consumidores de `getNegocio()`).
- `src/lib/services/negocio.ts`: `actualizarNegocio()` con cliente de cookies. La tabla tiene
  una sola fila con `id` numérico que no está en la interfaz `Negocio`: el service lo resuelve
  con `.select('id').limit(1).maybeSingle()`, hace UPDATE por ese id y cae a INSERT si no hay
  fila. `getNegocio()` (cacheado, cliente público) quedó intacto.

## Restricciones
- **Todos los casos de acceso a datos con `try/catch`** y fallback explícito.
- **Sin `SELECT *`**: solo las columnas que consume la UI.
- **Queries lineales, sin bucles**: nada de N+1; los agregados se calculan en memoria.
- Quality Gate: ningún archivo toca 150 líneas.
- Artefactos técnicos en inglés; copy de UI en español.
- No se agregan dependencias. No se toca `src/app/(public)/` salvo lo estrictamente necesario
  para los tipos compartidos.
- `npm run lint` no se ejecuta (ESLint 9 sin flat config, roto de forma preexistente).
- No levantar `next dev` ni `next build` en WSL: el binding nativo de Linux de lightningcss
  provoca SIGBUS. La verificación de runtime queda en Windows.
- Sin commits ni push dentro del writer: el parent cierra la unidad de trabajo.

## Criterios de aceptación
- [x] El panel no muestra ningún mock: lecturas y escrituras van a Supabase.
- [x] Los tipos de `src/lib/types/index.ts` coinciden con el esquema real.
- [x] La tabla de servicios muestra la imagen de la DB (o placeholder si no hay).
- [x] Editar un servicio no borra su `imagen_url`.
- [x] Guardar un servicio o una mascota invalida la caché pública (`updateTag`).
- [x] Todo acceso a datos está dentro de un `try/catch` con fallback.
- [x] El body no scrollea horizontalmente; panel y login usan `h-screen overflow-hidden`.
- [x] El aviso de acceso denegado usa el color de peligro del design system.
- [x] `npx tsc --noEmit` sale con código 0.
- [x] Ningún archivo del área tocada supera 150 líneas.
- [x] `/admin/clientes` existe con buscador y modal de historial de citas.
- [x] `/admin/notificaciones` existe con filtro por estado.
- [x] `/admin/negocio` existe con formulario y action `actualizarNegocio` + `updateTag('negocio')`.

## Checks aplicables
- `npx tsc --noEmit` (runner de tipos; no hay tests deterministas en el repo).
- Lectura estructural de los archivos tocados: campos usados, `try/catch`, longitudes.
- Verificación en runtime (Windows, fuera de este entorno): login → 200, `/admin` → 307,
  creación/edición/borrado en las tres entidades.

## Progreso

### T1 · UI/UX del shell
- [x] Body con `overflow-x-hidden`; panel y login con `h-screen overflow-hidden`; sidebar
      `h-full`; aviso de acceso denegado en color de peligro.

### T2 · Tipos alineados
- [x] Fase 1 completada: `src/lib/types/index.ts` con las 6 interfaces alineadas al esquema
      real + `ResumenDashboard` como extensión + 3 helpers puros.
- [x] Fallout de compilación resuelto en 14 archivos (consumidores del panel + mocks):
      `publica`→`publicado`, columna y campo "Propietario" eliminados, `fecha`/`hora`,
      `servicios?.nombre` y referencia derivada.
- [x] `npx tsc --noEmit`: exit 0 (verificado por el writer y repetido por el parent).

### T3 · Lecturas reales — [x] Fase 2 completada
- [x] 4 servicios existentes convertidos a lecturas reales + 2 servicios nuevos
      (`clientes.ts`, `notificaciones.ts`). 12 archivos tocados.
- [x] `npx tsc --noEmit`: exit 0 (writer + parent). Cada query verificada por `curl`
      read-only contra PostgREST.
- [x] Se eliminaron los datos ficticios de la UI: fecha del encabezado, mes del resumen,
      alerta de pendientes con la cita real de hoy, avisos de "datos de ejemplo" y el pie.
- [x] Escrituras (`upsert*`, `delete*`, `updateEstadoCita`) reales: Fase 3 completada.

### T4 · Escrituras reales — [x] Fase 3 completada
- [x] 3 services de escritura reales + 3 server actions con sesión, Zod, `updateTag` y
      `revalidatePath`. 13 archivos tocados.
- [x] `npx tsc --noEmit`: exit 0 (writer + parent). Queries verificadas por `curl` read-only.
- [x] Fix de imágenes: input de URL en los formularios + `next/image` en las dos filas.
- [ ] Sin smoke test de escritura real: no se autorizó mutar la base. Queda pendiente una
      prueba CRUD en runtime (Windows) o con autorización explícita.
- [ ] `crearCita` del formulario público sigue mockeada (`// TODO: persistir en Supabase`):
      el público ve una confirmación falsa y la cita no se guarda.

### T5 · UI admin con datos reales — [x] completada (Fases 2 y 3)
- [x] Todo lo listado en el alcance de T5 quedó implementado y verificado por typecheck.

### T6 · Vistas faltantes del panel — [x] Fase 4 completada
- [x] 3 vistas nuevas (11 archivos) + `actualizarNegocio` en el service. Máx. 147 líneas.
- [x] `npx tsc --noEmit`: exit 0 (writer + parent). Conteos reales verificados por `curl`:
      clientes 7, notificaciones 3, negocio 1.
- [x] `next-env.d.ts` restaurado: se había regenerado apuntando a `./.next/dev/types/`, que
      rompe el build en un clone limpio. Debe quedar fuera de los commits.
- [ ] `/admin/operacion` sigue sin existir (404): el sidebar lo enlaza y no está en el alcance
      pedido.

## Ruta de ejecución
- T1: inline (4 archivos ya entendidos, un solo archivo no trivial por archivo).
- Fase 1 (T2): delegated direct — un writer. Dispara el writer trigger: toca
  `src/lib/types/index.ts`, 4 archivos de `src/lib/services/`, 2 archivos de `actions/` y
  ~10 componentes del panel (2+ archivos no triviales). El parent verifica tipos,
  estructura y cobertura de `try/catch`.
- Fase 2 (T3): delegated direct — un writer (12 archivos). Parent verificó tsc, leyó
  `dashboard.ts` y `citas.ts`, y contrastó cada query con `curl` contra PostgREST.
- Fase 3 (T4 + imágenes): delegated direct — un writer (13 archivos). Parent verificó tsc, leyó
  `servicios.ts`, `mascotas.ts`, las 3 actions y los 4 componentes de UI, y contrastó los
  filtros de las escrituras con `curl` read-only contra PostgREST.
- Fase 4 (T6): delegated direct — un writer (11 archivos). Parent verificó tsc, restauró
  `next-env.d.ts`, leyó `negocio.ts`, `negocio/actions.ts`, `DetalleClienteModal.tsx` y
  `TablaNotificaciones.tsx`, y confirmó los conteos con `curl` read-only.
- Las 4 fases están implementadas. Pendientes de decisión del usuario: commit de las fases,
  `crearCita` del formulario público (sigue mockeada), smoke test CRUD real contra la base y
  la vista `/admin/operacion`.

## Próximo paso
Delegar T2-T5 al writer, verificar con `npx tsc --noEmit` y lectura estructural, y cerrar la
unidad de trabajo con un commit convencional.
