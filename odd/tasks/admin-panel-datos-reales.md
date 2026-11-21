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
- **`referencia` derivada**: la DB no la tiene; `Cita.referencia` se calcula en la capa de
  servicio como `HV-` + los primeros 6 caracteres del id en mayúsculas.
- **`servicio_nombre` por join**: `select='..., servicios(nombre)'` con el embed de PostgREST.
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

### T2 · Tipos alineados al esquema (`src/lib/types/index.ts`)
- `Mascota`: `publicado` en lugar de `publica`; sin `propietario` ni `slug`.
- `Cita`: `fecha` y `hora` en lugar de `fecha_preferida` y `hora_preferida`; `servicio_nombre`
 来自 join; `referencia` derivada; agrega `servicio_id`, `mascota_id`, `mascota_especie`.
- `ResumenEstadisticas`: se mantiene la forma (son agregados, no columnas).

### T3 · Lecturas reales
- `getMascotas()` real (columnas exactas de `mascotas`).
- `getCitas()` real con join `servicios(nombre)`; `getCitaById()` real.
- `getCitasHoy()` real (filtro por la fecha de hoy).
- `getResumenEstadisticas()` real (agregación en JS sobre 4 queries lineales).
- Todos con `try/catch` y fallback explícito (`[]`, `null` o el objeto de defaults).

### T4 · Escrituras reales
- `upsertServicio`, `deleteServicio`, `upsertMascota`, `deleteMascota`, `updateEstadoCita`
  reales, con `try/catch` y resultado `{ success, error? }`.
- Invalidación de caché: `updateTag('servicios')` / `updateTag('mascotas')` (las citas no
  tienen caché pública).
- Acciones: `guardarMascota` valida `publicado` y deja de validar `propietario`;
  `guardarServicio` deja de forzar `imagen_url: null` al editar.

### T5 · UI admin con datos reales
- `ServicioTableRow` renderiza `imagen_url` (con `next/image` y placeholder si es null).
- `MascotaTableRow`, `FormMascota`, `TablaMascotas`: `publicado` y sin columna Propietario.
- `FilaCita`, `DetalleCitaModal`, `TablaCitasHoy`: `fecha`, `hora`, `servicio_nombre` real.
- `AlertaPendientes`: sin nombres/citas fijas; usa la cita pendiente real.
- `ResumenCitas`: etiqueta de mes dinámica.
- `(panel)/page.tsx`: fecha real del día en lugar de "18 de noviembre de 2026".
- Se quitan los avisos de "datos de ejemplo" de `citas/page.tsx`, `mascotas/page.tsx` y del pie
  de `(panel)/layout.tsx`.

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
- [ ] El panel no muestra ningún mock: lecturas y escrituras van a Supabase.
- [ ] Los tipos de `src/lib/types/index.ts` coinciden con el esquema real.
- [ ] La tabla de servicios muestra la imagen de la DB (o placeholder si no hay).
- [ ] Editar un servicio no borra su `imagen_url`.
- [ ] Guardar un servicio o una mascota invalida la caché pública (`updateTag`).
- [ ] Todo acceso a datos está dentro de un `try/catch` con fallback.
- [ ] El body no scrollea horizontalmente; panel y login usan `h-screen overflow-hidden`.
- [ ] El aviso de acceso denegado usa el color de peligro del design system.
- [ ] `npx tsc --noEmit` sale con código 0.
- [ ] Ningún archivo del área tocada supera 150 líneas.

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
- [ ] Pendiente.

### T3 · Lecturas reales
- [ ] Pendiente.

### T4 · Escrituras reales
- [ ] Pendiente.

### T5 · UI admin con datos reales
- [ ] Pendiente.

## Ruta de ejecución
- T1: inline (4 archivos ya entendidos, un solo archivo no trivial por archivo).
- T2-T5: delegated direct — un writer. Dispara el writer trigger: toca
  `src/lib/types/index.ts`, 4 archivos de `src/lib/services/`, 3 archivos de `actions/` y
  ~10 componentes del panel (2+ archivos no triviales). El parent verifica tipos,
  estructura y cobertura de `try/catch`.

## Próximo paso
Delegar T2-T5 al writer, verificar con `npx tsc --noEmit` y lectura estructural, y cerrar la
unidad de trabajo con un commit convencional.
