import { createSupabaseServerClient } from '@/lib/supabase/server'

export interface Session {
  userId: string
  email: string
  role: 'admin'
}

/**
 * Obtiene la sesión activa del usuario desde Supabase.
 *
 * Esta función utiliza `supabase.auth.getUser()` que obtiene el usuario real
 * del token almacenado en las cookies (manejadas por el middleware).
 *
 * Devuelve null en los siguientes casos:
 * - No hay usuario autenticado
 * - El token expiró
 * - Hay un error en la consulta
 *
 * Uso en Server Components:
 * ```typescript
 * export default async function AdminPage() {
 *   const session = await getSession()
 *   if (!session) redirect('/admin/login')
 *   return <div>Bienvenido {session.email}</div>
 * }
 * ```
 *
 * @returns Session object si hay usuario autenticado, null de lo contrario
 * @throws Nunca lanza error, devuelve null si hay problemas
 */
export async function getSession(): Promise<Session | null> {
  try {
    const supabase = await createSupabaseServerClient()

    // getUser() obtiene el usuario real desde las cookies del servidor
    // No requiere credenciales adicionales, utiliza el token de sesión
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // Si hay error o no hay usuario, retorna null
    if (error || !user) {
      return null
    }

    // Mapea el usuario de Supabase a nuestra interfaz Session
    return {
      userId: user.id,
      email: user.email ?? '',
      role: 'admin', // TODO: Obtener rol real de la BD en el futuro
    }
  } catch (error) {
    // Loguea el error para debugging pero no lo lanza
    console.debug('[Session] Error obteniendo sesión:', error)
    return null
  }
}

/**
 * Verifica si hay una sesión activa (sin obtener los datos).
 * Más rápido que getSession() cuando solo necesitas saber si está autenticado.
 *
 * @returns true si hay sesión activa, false de lo contrario
 */
export async function isSessionActive(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}
