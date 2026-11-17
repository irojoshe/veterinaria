# Patrones de obtención de datos con Supabase

Este documento fija las reglas de oro del proyecto para leer datos de Supabase en el App Router de Next.js: **qué cliente usar**, **qué se cachea y qué no**, y **qué columnas se piden**. Aplicarlas evita tres clases de errores: caché que no invalida, páginas que rompen en runtime y queries que descargan columnas que nadie usa.

> Estado: este documento es el estándar del proyecto. `createSupabasePublicServerClient()` y `getServicios()` (lectura del panel) se implementan junto con la lectura real del catálogo de servicios.

## Inicio rápido

1. **¿La lectura es pública y estable?** → `createSupabasePublicServerClient()` + `unstable_cache`.
2. **¿La lectura depende de la sesión o debe verse al instante?** → `createSupabaseServerClient()` sin caché.
3. **¿Qué columnas pido?** → Exactamente las que la UI consume: ni más ni menos.
4. **¿Una sola query?** → Lineal, sin recursión ni consultas dentro de bucles.

## Reglas de oro

| Regla | Regla | Motivo |
| --- | --- | --- |
| Clientes | Cliente con cookies para sesión; cliente sin cookies para lecturas públicas cacheadas | `cookies()` dentro de `unstable_cache` lanza error en Next 16 |
| Caché | Cachear lo público y estable; no cachear lo que el admin debe ver al instante | El panel de administración refleja cambios en vivo |
| Columnas | Sin `SELECT *`: exactamente las columnas que la UI necesita | Menos datos, menos acoplamiento, menos riesgo |
| Errores | `try/catch` con fallback seguro (`[]` en lecturas públicas) | La página degrada, no se rompe |
| Query | Una consulta por función, lineal | Evita N+1 y consultas dentro de bucles |

---

## 1. Separación de clientes Supabase

Hay dos clientes y no son intercambiables. La diferencia está en las cookies.

| Cliente | Cookies | Uso | Caché |
| --- | --- | --- | --- |
| `createSupabaseServerClient()` | Sí (`await cookies()`) | Server Actions, rutas privadas, panel de administración, datos tiedos a la sesión del usuario | No cacheable |
| `createSupabasePublicServerClient()` | No | Lecturas públicas cacheables (catálogo de servicios, información de la clínica) | Compatible con `unstable_cache` |

### Por qué el cliente con cookies no puede vivir dentro de `unstable_cache`

`createSupabaseServerClient()` llama a `await cookies()`. En Next.js 16, leer una API dinámica dentro de un scope de cache lanza un error:

```js
// node_modules/next/dist/server/request/headers.js:45-46
case 'unstable-cache':
    throw createHeadersInUnstableCacheError(workStore.route);
```

Consecuencia práctica: **toda función cacheada que consulte Supabase debe usar el cliente sin cookies**. El cliente con cookies se reserva para el contexto de request (Server Actions y rutas privadas), donde la sesión del usuario forma parte de la respuesta.

### Cómo queda la separación

```ts
// src/lib/supabase/server.ts

// Con cookies: sesión del usuario. Server Actions y rutas privadas.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient(url, anonKey, { cookies: { getAll: () => cookieStore.getAll(), setAll: ... } })
}

// Sin cookies: solo lectura pública. Seguro dentro de unstable_cache.
export function createSupabasePublicServerClient() {
  return createServerClient(url, anonKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  })
}
```

> Regla: si la función va cacheada, no puede leer cookies, headers ni depender de la sesión.

---

## 2. Caché vs. datos volátiles

La caché no es un valor por defecto: depende de **quién consume el dato** y **con qué frecuencia cambia**.

| Lectura | ¿Cachear? | Motivo |
| --- | --- | --- |
| `getServiciosPublicos()` | Sí, con `unstable_cache` | Catálogo público: cambia pocas veces y lo consultan todas las visitas |
| `getServicios()` (panel) | No | El administrador necesita ver los cambios al instante, sin esperar revalidación |

### Lectura pública cacheada

```ts
// src/lib/services/servicios.ts
import { unstable_cache } from 'next/cache'
import { createSupabasePublicServerClient } from '@/lib/supabase/server'

export const getServiciosPublicos = unstable_cache(
  async (): Promise<Servicio[]> => {
    try {
      const supabase = createSupabasePublicServerClient()
      const { data, error } = await supabase
        .from('servicios')
        .select('id, nombre, descripcion, precio, imagen_url, slug, duracion_minutos')
        .eq('publicado', true)

      if (error) {
        console.error('[servicios] Error al leer servicios publicados:', error.message)
        return []
      }
      return data ?? []
    } catch (error) {
      console.error('[servicios] Error inesperado:', error)
      return []
    }
  },
  ['servicios-publicos'],
  { revalidate: 300, tags: ['servicios'] },
)
```

Puntos clave:

- La **consulta vive dentro** de la función cacheada: cacheamos el resultado, no el cliente.
- `revalidate: 300` define la ventana de frescura; `tags` permite invalidar la caché cuando el admin publica o edita un servicio.
- El `try/catch` devuelve `[]`: si Supabase falla, la página sigue renderizando con el catálogo vacío en vez de romperse.

### Lectura del panel sin caché

```ts
// src/lib/services/servicios.ts
export async function getServicios(): Promise<Servicio[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('servicios')
    .select('id, nombre, descripcion, precio, imagen_url, slug, duracion_minutos, publicado')
    .order('nombre')

  if (error) {
    console.error('[servicios] Error al leer servicios (admin):', error.message)
    return []
  }
  return data ?? []
}
```

El panel se lee en cada request: el admin edita un precio y lo ve al instante, sin esperar a que expire la caché.

La lectura del panel suma la columna `publicado` a las siete del catálogo porque su UI la consume (contador de publicados, badge "Publicado/Borrador" y valor por defecto del formulario de edición). Es la misma regla aplicada al revés: si el panel no mostrara ese estado, la columna no se pediría.

### Cómo decidir

| Pregunta | Si la respuesta es… | Decisión |
| --- | --- | --- |
| ¿El dato es público? | No | Sin caché |
| ¿Cambia con frecuencia? | Sí | Sin caché |
| ¿El admin necesita verlo ya? | Sí | Sin caché |
| ¿Es público y estable? | Sí | `unstable_cache` |

---

## 3. Regla de selección de columnas

**"No usar `SELECT *`" no significa "pedir pocas columnas": significa pedir exactamente las que la UI necesita, ni más ni menos.**

Las dos caras de la regla:

- Pedir columnas de más: acopla la capa de datos a la tabla completa, infla la respuesta y expone campos que la UI no usa.
- Pedir columnas de menos: la UI lee `undefined` y se rompe en silencio (un `value={s.slug}` vacío en un `<select>`, un link `/servicios/undefined`).

### Columnas del catálogo de servicios

| Columna | Dónde la consume la UI |
| --- | --- |
| `id` | `key` de las tarjetas y de las opciones del selector |
| `nombre` | Título de la tarjeta, opción del selector de cita |
| `descripcion` | Texto descriptivo de la tarjeta |
| `precio` | Precio en la tarjeta y en el selector de cita |
| `imagen_url` | Fotografía de la tarjeta |
| `slug` | `value` del selector de cita y enlaces de detalle |
| `duracion_minutos` | Duración mostrada en la tarjeta y en el selector de cita |

La lista completa es:

```ts
.select('id, nombre, descripcion, precio, imagen_url, slug, duracion_minutos')
```

Cuando la UI cambie (por ejemplo, si el selector de cita deja de usar `slug`), la lista de columnas se actualiza **en el mismo cambio**. Si la UI usa un campo, ese campo está en el `select`; si no lo usa, no está.

---

## 4. Errores y resiliencia

Supabase no lanza excepciones: devuelve `{ data, error }`. Por eso el error se comprueba de forma explícita.

```ts
const { data, error } = await supabase.from('servicios').select('...')

if (error) {
  console.error('[servicios] Error al leer servicios:', error.message)
  return []
}

return data ?? []
```

Reglas:

- El `try/catch` cubre fallos inesperados (red, cliente mal inicializado, variables de entorno ausentes).
- El fallback de una lectura pública es un array vacío: la página degrada sin romper el render.
- Los errores se registran con contexto (`[servicios]`) para poder rastrearlos en los logs del servidor.

---

## 5. Dónde vive cada cosa

| Archivo | Responsabilidad |
| --- | --- |
| `src/lib/supabase/server.ts` | Clientes: con cookies (`createSupabaseServerClient`) y sin cookies (`createSupabasePublicServerClient`) |
| `src/lib/services/servicios.ts` | Lecturas de servicios: pública cacheada (`getServiciosPublicos`) y de administración sin caché (`getServicios`) |
| `src/lib/types/index.ts` | Tipos compartidos (`Servicio`, `ServicioPublico`) |

| Función | Cliente | Caché | Filtro | Columnas |
| --- | --- | --- | --- | --- |
| `getServiciosPublicos()` | Sin cookies | `unstable_cache` | `publicado = true` | 7 columnas del catálogo |
| `getServicios()` | Con cookies | Ninguna | Todos los servicios | 7 columnas del catálogo + `publicado` |

---

## Checklist de revisión

Antes de dar por buena una lectura de datos:

- [ ] La función cacheada usa `createSupabasePublicServerClient()` y no lee cookies.
- [ ] La lectura del panel de administración no está cacheada.
- [ ] El `select` lista exactamente las columnas que consume la UI.
- [ ] Los errores se comprueban y se registra el contexto.
- [ ] El fallback de error es seguro (array vacío, no `undefined`).
- [ ] Hay una sola consulta, sin recursión ni consultas dentro de bucles.

## Referencias

- `src/lib/supabase/server.ts` — definición de los dos clientes.
- `src/lib/services/servicios.ts` — lecturas de servicios.
- Next.js 16: `node_modules/next/dist/server/request/headers.js:45-46` — `cookies()` dentro de `unstable_cache` lanza error.
