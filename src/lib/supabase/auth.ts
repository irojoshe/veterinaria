/**
 * Funciones de autenticación para Server Components y Server Actions.
 * Estas funciones utilizan el cliente de Supabase Server-side.
 */

import { createSupabaseServerClient } from './server'

/**
 * Obtiene la sesión actual del usuario (Server-side).
 * Útil para Server Components que necesitan verificar si el usuario está autenticado.
 *
 * @example
 * export default async function ProtectedPage() {
 *   const { session, user } = await getServerSession()
 *   if (!session) redirect('/login')
 *   return <div>Hola {user?.email}</div>
 * }
 */
export async function getServerSession() {
  const supabase = await createSupabaseServerClient()

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) throw error

    return {
      session,
      user: session?.user ?? null,
    }
  } catch (error) {
    console.error('[Supabase Auth] Error obteniendo sesión:', error)
    return {
      session: null,
      user: null,
    }
  }
}

/**
 * Obtiene el usuario actual (Server-side).
 *
 * @example
 * const user = await getServerUser()
 * if (!user) redirect('/login')
 */
export async function getServerUser() {
  const supabase = await createSupabaseServerClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) throw error

    return user
  } catch (error) {
    console.error('[Supabase Auth] Error obteniendo usuario:', error)
    return null
  }
}

/**
 * Realiza login en Server Action.
 * Nota: Para login, es mejor usar un Client Component que luego valida en servidor.
 *
 * @example
 * 'use server'
 * export async function login(email: string, password: string) {
 *   const result = await loginServerAction(email, password)
 *   if (result.error) return { error: result.error }
 *   redirect('/admin')
 * }
 */
export async function loginServerAction(email: string, password: string) {
  const supabase = await createSupabaseServerClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error desconocido'
    return { success: false, error: message }
  }
}

/**
 * Realiza logout en Server Action.
 *
 * @example
 * 'use server'
 * export async function logout() {
 *   await logoutServerAction()
 *   redirect('/login')
 * }
 */
export async function logoutServerAction() {
  const supabase = await createSupabaseServerClient()

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error desconocido'
    return { success: false, error: message }
  }
}

/**
 * Obtiene el usuario actual y redirige si no está autenticado.
 * Para usar en Server Components que requieren autenticación.
 *
 * @example
 * export default async function ProtectedPage() {
 *   const user = await requireServerUser()
 *   return <div>Hola {user.email}</div>
 * }
 */
export async function requireServerUser() {
  const user = await getServerUser()

  if (!user) {
    throw new Error('Usuario no autenticado')
  }

  return user
}
