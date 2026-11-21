import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Proxy para Next.js App Router (Next.js 16+).
 *
 * Responsabilidad única: proteger las rutas del panel.
 *
 * 1. Refresca la sesión de Supabase en cada request (mantiene tokens activos).
 * 2. Protege /admin/*: sin sesión redirige a /admin/login.
 *
 * La ruta /admin/login queda fuera de la protección: el login nunca exige sesión
 * previa. Si el usuario ya está autenticado, `src/app/admin/login/page.tsx` lo
 * redirige a /admin. Cada decisión en un solo lugar evita que el proxy y la
 * página compitan por el mismo redirect.
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
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
          } catch (error) {
            console.debug('[Supabase Proxy] Error escribiendo cookies:', error)
          }
        },
      },
    }
  )

  // Refresca la sesión y obtiene el usuario actual
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Protege /admin/* (excepto /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return redirectWithCookies(url, response)
  }

  return response
}

/**
 * Crea un redirect conservando las cookies que Supabase refrescó en `response`.
 * Sin esto, la respuesta de redirect descartaba los tokens renovados y el
 * navegador enviaba de nuevo una sesión caducada en el siguiente request.
 */
function redirectWithCookies(url: URL, response: NextResponse): NextResponse {
  const redirectResponse = NextResponse.redirect(url)
  response.cookies.getAll().forEach(({ name, value, ...options }) => {
    redirectResponse.cookies.set(name, value, options)
  })
  return redirectResponse
}

// Ejecuta proxy en todas las rutas excepto assets estáticos
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)',
  ],
}
