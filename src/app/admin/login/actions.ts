'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const loginSchema = z.object({
  email: z.string().email('Introduce un email válido.'),
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
 * 3. Verifica que el user_id exista en la tabla 'admins'
 * 4. Si no es admin, cierra sesión y rechaza
 * 5. Si es admin, redirige a /admin
 */
export async function loginAdmin(
  _prev: LoginResult | null,
  formData: FormData
): Promise<LoginResult> {
  // 1. Validación de datos con Zod
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }
  }

  const supabase = await createSupabaseServerClient()

  // 2. Autentica contra Supabase Auth
  const { error: authError, data } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (authError || !data?.user) {
    return { success: false, error: 'Credenciales inválidas.' }
  }

  const userId = data.user.id

  // 3. Verifica que el usuario sea admin en la tabla 'admins' (por user_id)
  const { data: adminRecord, error: queryError } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (queryError || !adminRecord) {
    // Usuario autenticado pero no es admin: cierra sesión inmediatamente
    await supabase.auth.signOut()
    return { success: false, error: 'Credenciales inválidas.' }
  }

  // 4. Usuario es admin, redirige a /admin
  redirect('/admin')

  return { success: false, error: 'Credenciales inválidas.' }
}
