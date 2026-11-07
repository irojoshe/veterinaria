import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Proxy para Next.js App Router (Next.js 16+).
 * Refresca la sesión de Supabase en cada request.
 * Esto mantiene la autenticación activa aunque el token expire.
 *
 * Implementación siguiendo la documentación oficial de Supabase.
 * El try/catch en setAll maneja casos donde no se pueden escribir cookies.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          } catch (error) {
            // Ignorar error si no se pueden escribir cookies en proxy
            console.debug('[Supabase Proxy] Error escribiendo cookies:', error)
          }
        },
      },
    }
  )

  // Refresca la sesión (importante para mantener tokens activos)
  try {
    await supabase.auth.getSession()
  } catch (error) {
    console.debug('[Supabase Proxy] Error refrescando sesión:', error)
  }

  return response
}

// Ejecuta proxy en todas las rutas excepto assets estáticos
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)',
  ],
}
