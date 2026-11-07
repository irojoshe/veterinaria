import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Utilidades comunes para operaciones con Supabase.
 */

/**
 * Maneja errores de Supabase de forma consistente.
 */
export function handleSupabaseError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }

  return 'Ocurrió un error inesperado'
}

/**
 * Verifica si el usuario está autenticado.
 */
export async function isAuthenticated(supabase: SupabaseClient): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  } catch {
    return false
  }
}

/**
 * Obtiene el usuario actual.
 */
export async function getCurrentUser(supabase: SupabaseClient) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

/**
 * Realiza logout del usuario.
 */
export async function logout(supabase: SupabaseClient) {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
    }
  }
}

/**
 * Realiza login con email y contraseña.
 */
export async function login(
  supabase: SupabaseClient,
  email: string,
  password: string
) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
    }
  }
}

/**
 * Realiza signup con email y contraseña.
 */
export async function signup(
  supabase: SupabaseClient,
  email: string,
  password: string
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
    }
  }
}
