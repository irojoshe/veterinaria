'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const loginSchema = z.object({
  email:    z.string().email('Introduce un email válido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
})

export interface LoginResult {
  success: false
  error: string
}

/**
 * Server Action para autenticar administradores.
 *
 * Flujo:
 * 1. Valida datos con Zod (email, password)
 * 2. Autentica contra Supabase Auth (signInWithPassword)
 * 3. Verifica que el usuario exista en tabla 'admins'
 * 4. Si no es admin, cierra sesión y rechaza
 * 5. Si es admin, redirige a /admin
 * 6. Siempre retorna error genérico para prevenir enumeración de usuarios
 */
export async function loginAdmin(
  _prev: LoginResult | null,
  formData: FormData
): Promise<LoginResult> {
  // 1. Validación de datos con Zod
  const parsed = loginSchema.safeParse({
    email:    formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? 'Datos inválidos.' }
  }

  const supabase = await createSupabaseServerClient()

  // 2. Autentica contra Supabase Auth
  const { error: authError, data } = await supabase.auth.signInWithPassword({
    email:    parsed.data.email,
    password: parsed.data.password,
  })

  if (authError) {
    // Retorna error genérico (sin exponer detalles técnicos)
    return {
      success: false,
      error: 'Credenciales inválidas.',
    }
  }

  // Obtener el ID del usuario autenticado
  const userId = data?.user?.id

  if (!userId) {
    // Cierra sesión si no hay ID de usuario
    await supabase.auth.signOut()
    return {
      success: false,
      error: 'Credenciales inválidas.',
    }
  }

  // 3. Verifica que el usuario sea admin en la tabla 'admins'
  const { data: adminRecord, error: queryError } = await supabase
    .from('admins')
    .select('id, email')
    .eq('email', parsed.data.email)
    .single()

  if (queryError || !adminRecord) {
    // Usuario autenticado pero no es admin
    // Cierra sesión inmediatamente
    await supabase.auth.signOut()

    return {
      success: false,
      error: 'Credenciales inválidas.',
    }
  }

  // 4. Usuario es admin, redirige a /admin
  redirect('/admin')

  // Nota: El código nunca llega aquí, pero TypeScript requiere este return
  // porque redirect() no está tipado como NoReturn en su definición
  return { success: false, error: 'Credenciales inválidas.' }
}
