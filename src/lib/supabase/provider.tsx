'use client'

import { createContext, ReactNode, useContext } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseBrowserClient } from './client'

/**
 * Contexto para proporcionar el cliente de Supabase a componentes.
 * Uso: Envuelve tu app con <SupabaseProvider> en el layout.
 */
const SupabaseContext = createContext<SupabaseClient | null>(null)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const supabase = createSupabaseBrowserClient()

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

/**
 * Hook para usar el cliente de Supabase.
 * Solo funcionará dentro de un SupabaseProvider.
 *
 * @example
 * 'use client'
 * import { useSupabaseContext } from '@/lib/supabase/provider'
 *
 * export default function MyComponent() {
 *   const supabase = useSupabaseContext()
 *   // Usa supabase aquí
 * }
 */
export function useSupabaseContext() {
  const supabase = useContext(SupabaseContext)
  if (!supabase) {
    throw new Error('useSupabaseContext debe usarse dentro de SupabaseProvider')
  }
  return supabase
}
