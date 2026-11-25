import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { getImageKitAuthParams } from '@/lib/imagekit/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Issues short lived ImageKit upload credentials to authenticated admins.
 *
 * The browser uploads the file straight to ImageKit, so the private key stays
 * on the server. The response only carries the public key and the signature.
 */
export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { token, expire, signature } = getImageKitAuthParams()

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ?? '',
    })
  } catch (error) {
    console.error(
      '[imagekit-auth] Error al generar los parametros de subida:',
      error,
    )
    return NextResponse.json(
      { error: 'No se pudieron generar los permisos de subida.' },
      { status: 500 },
    )
  }
}
