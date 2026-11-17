import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Cliente de Supabase para Server Components y Server Actions.
 *
 * Implementación siguiendo la documentación oficial de Supabase para Next.js 15 App Router.
 * Maneja cookies de forma segura con try/catch en setAll para evitar errores
 * cuando las cookies no se pueden escribir (ej: en requests GET).
 *
 * Uso:
 * ```typescript
 * // En Server Components
 * const supabase = await createSupabaseServerClient()
 * const { data } = await supabase.from('table').select()
 *
 * // En Server Actions
 * 'use server'
 * const supabase = await createSupabaseServerClient()
 * await supabase.from('table').insert(data)
 * ```
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // Nota: Esto ocurre cuando no se pueden escribir cookies.
            // Por ejemplo, en requests GET después de un redirect.
            // Es seguro ignorar este error en la mayoría de los casos.
            console.debug('[Supabase] Error al escribir cookies:', error)
          }
        },
      },
    }
  )
}

/**
 * Cliente de Supabase para lecturas públicas cacheables.
 *
 * No usa cookies a propósito: dentro de `unstable_cache` cualquier lectura de
 * cookies o headers lanza un error en Next.js 16
 * (node_modules/next/dist/server/request/headers.js:45-46).
 *
 * Solo usar para datos públicos que no dependan de la sesión del usuario.
 * Ver docs/patterns/data-fetching.md.
 */
export function createSupabasePublicServerClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  )
}
