# Arquitectura de caché del proyecto veterinario

Documento vivo. Refleja el **estado real** del proyecto al 19 de noviembre de 2026 (rama `feat/home-servicios-supabase`) y el plan de integración progresiva para completar la arquitectura de caché.

> **Regla de honestidad**: las secciones marcadas como **IMPLEMENTADO** existen y funcionan hoy. Las marcadas como **PLAN** son trabajo pendiente que todavía no se ha ejecutado. No afirmar que algo está implementado si solo se ha preparado el código.

---

## 1. Estado actual (IMPLEMENTADO)

### 1.1 Stack relevante

| Componente | Versión |
|---|---|
| Next.js | 16.4.5 (App Router, Turbopack) |
| React | 18 (deprecado; se elimina en Next 17) |
| Supabase | `@supabase/ssr` + `@supabase/supabase-js` |
| TypeScript | strict |
| Zod | 3.x (validación de formularios) |
| Tailwind | 4 (tokens en `src/styles/globals.css`) |

### 1.2 Dos clientes Supabase

Definidos en `src/lib/supabase/server.ts`:

| Cliente | Cookies | Uso | Cacheable |
|---|---|---|---|
| `createSupabaseServerClient()` | Sí (`await cookies()`) | Server Actions, rutas privadas, panel admin, sesión | No |
| `createSupabasePublicServerClient()` | No (array vacío) | Lecturas públicas cacheables | Sí |

**Motivo de la separación**: en Next.js 16, leer `cookies()` dentro de `unstable_cache` lanza un error (`node_modules/next/dist/server/request/headers.js:45-46`). Por eso toda función cacheada usa el cliente sin cookies.

### 1.3 Lecturas públicas cacheadas (IMPLEMENTADO)

| Función | Archivo | Cliente | Revalidate | Tags | Columnas |
|---|---|---|---|---|---|
| `getServiciosPublicos()` | `src/lib/services/servicios.ts` | Sin cookies | 300s | `['servicios']` | 7 (id, nombre, descripcion, precio, imagen_url, slug, duracion_minutos) |
| `getServicioBySlug(slug)` | `src/lib/services/servicios.ts` | Sin cookies | 300s | `['servicios']` | 7 (mismas) |
| `getMascotasPublicas()` | `src/lib/services/mascotas.ts` | Sin cookies | 300s | `['mascotas']` | 15 (id, nombre, especie, raza, sexo, fecha_nacimiento, foto_url, precio, historia, estado_adopcion, vacunado, esterilizado, microchip, compatible_ninos, compatible_mascotas) |
| `getNegocio()` | `src/lib/services/negocio.ts` | Sin cookies | 300s | `['negocio']` | 8 (nombre, descripcion, direccion, telefono, email, whatsapp, horario, mapa_url) |

Regla aplicada: **sin `SELECT *`**. Cada lectura pide exactamente las columnas que su UI consume.

Regla especial para `getServicioBySlug(slug)`: el slug **no** forma parte de la clave de caché (`['servicio-publico']` compartida), pero sí del argumento de la función cacheada. Cada slug genera su propia entrada en caché. La etiqueta compartida `['servicios']` permite invalidar todas las entradas por slug de una vez.

### 1.4 Lecturas administrativas sin caché (IMPLEMENTADO)

| Función | Archivo | Cliente | Caché | Columnas |
|---|---|---|---|---|
| `getServicios()` | `src/lib/services/servicios.ts` | Con cookies | Ninguna | 7 + `publicado` |
| `getMascotas()` | `src/lib/services/mascotas.ts` | Mock (sin DB) | — | — (mock legacy) |
| `getSession()` | `src/lib/auth/session.ts` | Con cookies | Ninguna | — |
| `getNegocio()` (admin no existe) | — | — | — | — |

**Deuda**: `getMascotas()` del panel admin sigue siendo un mock (`MASCOTAS_MOCK`). El tipo `Mascota` del panel usa campos legacy (`publica`, `propietario`) que no existen en la tabla real (`publicado`, sin `propietario`).

### 1.5 Invalidación actual (IMPLEMENTADO parcialmente)

Los admin actions usan `revalidatePath()`:

| Archivo | Acción | Rutas invalidadas |
|---|---|---|
| `src/app/admin/servicios/actions.ts` | upsert/delete | `/admin/servicios`, `/servicios` |
| `src/app/admin/mascotas/actions.ts` | upsert/delete | `/admin/mascotas`, `/mascotas` |
| `src/app/admin/citas/actions.ts` | upsert | `/admin/citas`, `/admin` |

**Limitación actual**: se usa solo `revalidatePath()`, no `updateTag()`. Si una misma lectura cacheada se consume en varias rutas (ej. `getServiciosPublicos()` en `/` y `/servicios`), `revalidatePath('/servicios')` invalida esa ruta pero no garantiza la invalidación de la entrada compartida que consume otra página. Ver sección 3 (PLAN) para la solución.

### 1.6 CRUD real (NO IMPLEMENTADO — mocks)

| Función | Archivo | Estado |
|---|---|---|
| `upsertServicio()` | `src/lib/services/servicios.ts` | Mock (`console.log`) |
| `deleteServicio()` | `src/lib/services/servicios.ts` | Mock (`console.log`) |
| `upsertMascota()` | `src/lib/services/mascotas.ts` | Mock (`console.log`) |
| `deleteMascota()` | `src/lib/services/mascotas.ts` | Mock (`console.log`) |

Los admin actions llaman a estas funciones mock; por eso las escrituras no persisten en Supabase.

### 1.7 Paginación (NO IMPLEMENTADO)

No hay paginación en ninguna lectura. El catálogo de mascotas carga todas las filas publicadas. Para comenzar se recomienda 8 registros por página con `.range()`.

### 1.8 Autenticación y protección de rutas (IMPLEMENTADO)

- `src/proxy.ts`: refresca sesión + protege `/admin/*` (sin sesión → redirect a `/admin/login`; con sesión en `/admin/login` → redirect a `/admin`).
- `src/app/admin/layout.tsx`: verifica sesión en servidor (`getSession()`) y redirige si no existe.
- `src/app/admin/login/actions.ts`: `loginAdmin` valida con Zod, usa `signInWithPassword`, verifica `user_id` en tabla `admins`, redirige a `/admin`.

### 1.9 Arquitectura general

```
src/
├── app/
│   ├── (public)/          → Rutas públicas (home, servicios, mascotas, cita, contacto, privacidad)
│   ├── admin/             → Panel de administración (protegido por proxy + layout)
│   └── layout.tsx         → Root layout
├── components/
│   ├── ui/                → Button, Card, Input, Modal, Badge
│   └── layout/            → Navbar, Footer, AdminSidebar, AdminTopbar
├── lib/
│   ├── auth/session.ts    → getSession() (Supabase auth)
│   ├── services/          → mascotas, negocio, servicios, citas, dashboard
│   ├── supabase/server.ts → Dos clientes (con/sin cookies)
│   ├── types/index.ts     → Servicio, Mascota, Negocio, MascotaPublica, etc.
│   ├── utils/date.ts      → calcularEdadExacta()
│   └── validations/       → Schemas Zod
└── styles/globals.css     → Tokens de Tailwind 4
```

Patrón: App Router con Server Components por defecto; Client Components solo donde hay interactividad. Server Actions para mutaciones. Servicios en `src/lib/services/`. Proxy (middleware) para protección de rutas.

---

## 2. Plan de integración (8 fases)

> **Regla fundamental**: no pasar a la siguiente fase hasta verificar la anterior. Ejecutar una fase, verificar resultados, continuar.

### Fase 1. Auditoría del proyecto (COMPLETADA)

Inventario de archivos y estado. Resultado: este documento (sección 1).

### Fase 2. Verificar los dos clientes Supabase (COMPLETADA)

Ambos clientes existen y cumplen las condiciones:
- Cliente público: no ejecuta `cookies()`, no depende de sesión, usa credenciales públicas.
- Cliente privado: ejecuta `await cookies()`, conserva sesión autenticada.

No se crearon clientes nuevos.

### Fase 3. Integrar las lecturas públicas cacheadas (COMPLETADA)

Las cuatro lecturas públicas (`getServiciosPublicos`, `getServicioBySlug`, `getMascotasPublicas`, `getNegocio`) usan `createSupabasePublicServerClient()` + `unstable_cache` con etiquetas y revalidate 300. Sin `SELECT *`.

### Fase 4. Mantener las lecturas administrativas sin caché (PARCIAL)

- `getServicios()` y `getSession()` ya son directas (sin caché). ✓
- `getMascotas()` del panel admin sigue siendo **mock**. ✗
- No hay paginación (`.range()`). ✗
- Consultas de citas y dashboard no están cacheadas (correcto, son datos volátiles). ✓

**Pendiente**: sustituir mock de mascotas por consulta real, unificar tipo `Mascota` con esquema real, agregar paginación (8 por página).

### Fase 5. Implementar el CRUD real (NO INICIADA)

Orden de implementación:

| Orden | Operación |
|---|---|
| 1 | `upsertServicio()` |
| 2 | `deleteServicio()` |
| 3 | `upsertMascota()` |
| 4 | `deleteMascota()` |

Cada Server Action debe seguir este algoritmo:

```
Recibir datos
    ↓
Validar con Zod
    ↓
Comprobar sesión
    ↓
Comprobar rol de administrador
    ↓
Ejecutar operación en Supabase
    ↓
¿Operación exitosa?
    ├── NO → Devolver error
    └── SÍ → Invalidar caché y rutas afectadas
                 ↓
              Devolver éxito
```

No confiar únicamente en `proxy.ts` o en el layout para proteger las acciones. Cada Server Action debe comprobar permisos antes de modificar datos.

### Fase 6. Integrar correctamente la invalidación (PLAN)

**No usar solo `revalidatePath()`** para invalidar datos compartidos. Combinar `updateTag()` y `revalidatePath()`, cada una con su responsabilidad.

#### A. En Server Actions: `updateTag()`

Para una modificación administrativa que debe reflejarse inmediatamente:

```ts
'use server'
import { updateTag, revalidatePath } from 'next/cache'

export async function actualizarServicio(datos: ServicioInput) {
  // Validar datos.
  // Comprobar administrador.
  // Actualizar Supabase.

  // Solo después del éxito:
  updateTag('servicios-publicos')

  revalidatePath('/admin/servicios')
  revalidatePath('/servicios')

  return { success: true }
}
```

`updateTag()` invalida todas las entradas asociadas a esa etiqueta y está diseñado para que una modificación sea visible inmediatamente. Solo se puede utilizar en Server Actions.

#### B. Qué invalidar según la entidad

| Acción | Etiqueta | Rutas adicionales |
|---|---|---|
| Crear/editar/eliminar servicio | `servicios-publicos` | `/admin/servicios`, `/servicios`, `/` |
| Cambiar estado de servicio | `servicios-publicos` | `/admin/servicios`, `/servicios`, `/` |
| Crear/editar/eliminar mascota | `mascotas-publicas` | `/admin/mascotas`, `/mascotas`, `/` |
| Cambiar estado de mascota | `mascotas-publicas` | `/admin/mascotas`, `/mascotas`, `/` |
| Editar información del negocio | `negocio-publico` | `/`, `/contacto` |

Las rutas adicionales se incluyen solo si existen y muestran esos datos. La etiqueta compartida invalida también las lecturas por slug (no hace falta invalidar manualmente cada slug).

#### C. En Route Handlers: `revalidateTag()`

Si en el futuro una integración externa modifica datos:

```ts
import { revalidateTag } from 'next/cache'
revalidateTag('servicios-publicos', 'max')
```

Esto permite una actualización en segundo plano, mostrando temporalmente los datos anteriores mientras se actualizan. Es distinto de `updateTag()`.

**Regla definitiva**:
- Server Actions administrativas: `updateTag()` + `revalidatePath()` cuando corresponda.
- Route Handlers externos: `revalidateTag(tag, 'max')`.
- No llamar a las tres funciones indiscriminadamente.
- No invalidar nada cuando Supabase devuelve un error.

### Fase 7. Comprobar la integración (PLAN)

| Prueba | Resultado esperado |
|---|---|
| Abrir catálogo por primera vez | Consulta Supabase |
| Abrirlo nuevamente con caché válida | Reutiliza caché |
| Crear mascota desde administración | Aparece en el catálogo si es publicable |
| Ocultar mascota | Desaparece del catálogo |
| Marcar mascota como vendida | Desaparece del público, permanece en administración |
| Modificar un servicio | Se actualiza catálogo y detalle |
| Modificar información del negocio | Se actualizan las páginas que la utilizan |
| Fallar una escritura | No se invalida la caché |
| Cambiar página administrativa | Consulta el intervalo correspondiente |
| Abrir citas pendientes | Datos directos, sin caché |

También comprobar: que una búsqueda no conserva una página incorrecta, que una edición no duplica registros, que los errores no se convierten silenciosamente en resultados vacíos cacheados, que las políticas RLS siguen funcionando, que las rutas dinámicas de servicios funcionan correctamente.

Ejecutar finalmente:

```
npx tsc --noEmit
npm run build
```

### Fase 8. Actualizar la documentación (PLAN)

| Archivo | Actualización |
|---|---|
| `docs/patterns/data-fetching.md` | Clientes, caché, etiquetas, invalidación y paginación |
| `docs/estado-proyecto.md` | Qué quedó implementado y qué sigue pendiente |
| `odd/tasks/` | Marcar las tareas terminadas y registrar las pruebas |

No crear documentación duplicada si ya existe una sección que cumple esa función.

---

## 3. Resumen del algoritmo completo

1. Auditar archivos y dependencias existentes. ✓
2. Verificar los dos clientes Supabase. ✓
3. Integrar `unstable_cache` en las cuatro lecturas públicas. ✓
4. Mantener las consultas administrativas directas y añadir paginación. (Parcial)
5. Sustituir los mocks de escritura por CRUD real. (Pendiente)
6. Integrar `updateTag()` y `revalidatePath()` en las acciones exitosas. (Pendiente)
7. Realizar pruebas de caché, consistencia, permisos y paginación. (Pendiente)
8. Actualizar documentación y estado del proyecto. (Pendiente)

Sin infraestructura adicional: se conserva Next.js, Supabase, los servicios existentes y la estructura actual.

## 4. Reglas que debe respetar quien implemente

1. No reconstruir el proyecto.
2. No reemplazar componentes visuales ni modificar el diseño Figma.
3. No cambiar rutas existentes sin necesidad.
4. No crear nuevos clientes Supabase si ya existen.
5. No duplicar funciones de lectura.
6. No introducir `use cache`, Redis ni proveedores adicionales.
7. No cachear sesiones, citas ni datos administrativos.
8. No utilizar `SELECT *`.
9. No modificar el esquema de la base de datos salvo que se detecte una incompatibilidad real que deba corregirse.
10. No convertir mocks en supuestas operaciones exitosas: sustituirlos por escrituras reales.
11. Mantener TypeScript estricto y Zod.
12. Si una fase falla, corregirla antes de continuar.
13. Informar qué archivos se modificaron y por qué.
14. No afirmar que algo está implementado si solamente se ha preparado el código.
15. No actualizar dependencias automáticamente durante la implementación de caché.

## 5. Referencias

- Documentación oficial: [unstable_cache](https://nextjs.org/docs/app/api-reference/functions/unstable_cache), [updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag), [revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath).
- `docs/patterns/data-fetching.md` — reglas de oro de obtención de datos.
- `src/lib/supabase/server.ts` — definición de los dos clientes.
- `src/lib/services/servicios.ts`, `mascotas.ts`, `negocio.ts` — lecturas implementadas.
- Next.js 16: `node_modules/next/dist/server/request/headers.js:45-46` — `cookies()` dentro de `unstable_cache` lanza error.