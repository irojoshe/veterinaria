/**
 * Punto de entrada central para importar todas las utilidades de Supabase.
 *
 * Uso:
 * import { createSupabaseServerClient, useSupabase, getServerUser } from '@/lib/supabase'
 */

// Server
export { createSupabaseServerClient } from './server'

// Client
export { createSupabaseBrowserClient, useSupabase } from './client'

// Provider
export { SupabaseProvider, useSupabaseContext } from './provider'

// Auth Server
export {
  getServerSession,
  getServerUser,
  loginServerAction,
  logoutServerAction,
  requireServerUser,
} from './auth'

// Utils
export {
  handleSupabaseError,
  isAuthenticated,
  getCurrentUser,
  logout,
  login,
  signup,
} from './utils'
