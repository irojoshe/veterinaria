'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase para Client Components.
 * Usa createBrowserClient que maneja cookies automáticamente en el navegador.
 * Singleton pattern: se crea una sola instancia durante la vida de la app.
 */
let supabaseBrowserClient: SupabaseClient | null = null

export function createSupabaseBrowserClient() {
  // Si ya existe una instancia, devuelve la existente (singleton)
  if (supabaseBrowserClient) {
    return supabaseBrowserClient
  }

  supabaseBrowserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return supabaseBrowserClient
}

/**
 * Hook para acceder al cliente de Supabase en Client Components.
 * Uso en Client Components:
 *
 * @example
 * 'use client'
 * import { useSupabase } from '@/lib/supabase/client'
 *
 * export default function MyComponent() {
 *   const supabase = useSupabase()
 *   // Usa supabase para queries, mutations, etc.
 * }
 */
export function useSupabase() {
  return createSupabaseBrowserClient()
}
