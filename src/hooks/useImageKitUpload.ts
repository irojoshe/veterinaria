'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from '@imagekit/next'

export interface ResultadoSubida {
  url: string
  fileId: string
}

const ERROR_RESPUESTA_INVALIDA =
  'ImageKit no devolvio los datos del archivo subido.'

function getUploadErrorMessage(error: unknown): string {
  if (error instanceof ImageKitAbortError) return 'Subida cancelada.'
  if (error instanceof ImageKitInvalidRequestError)
    return 'La solicitud de subida no es válida.'
  if (error instanceof ImageKitServerError)
    return 'Error del servidor de ImageKit.'
  if (error instanceof ImageKitUploadNetworkError)
    return 'Error de conexión al subir la imagen.'
  if (error instanceof Error && error.message === ERROR_RESPUESTA_INVALIDA)
    return ERROR_RESPUESTA_INVALIDA
  return 'No se pudo subir la imagen.'
}

/**
 * Uploads an image straight to ImageKit from the browser.
 *
 * The upload token is requested per call because ImageKit rejects a reused
 * token. The private key never reaches the browser.
 */
export function useImageKitUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      controllerRef.current?.abort()
    }
  }, [])

  const uploadFile = useCallback(
    async (file: File): Promise<ResultadoSubida> => {
      setIsUploading(true)
      setProgress(0)
      setError(null)

      const controller = new AbortController()
      controllerRef.current = controller

      try {
        const response = await fetch('/api/imagekit-auth', { cache: 'no-store' })
        if (!response.ok) {
          const body = await response.json().catch(() => null)
          throw new Error(
            body?.error ?? 'No se pudieron obtener los permisos de subida.',
          )
        }

        const auth = await response.json()

        const result = await upload({
          file,
          fileName: file.name,
          token: auth.token,
          expire: auth.expire,
          signature: auth.signature,
          publicKey: auth.publicKey,
          folder: '/huella-vet',
          useUniqueFileName: true,
          onProgress: (event) => {
            if (event.lengthComputable && mountedRef.current) {
              setProgress(Math.round((event.loaded / event.total) * 100))
            }
          },
          abortSignal: controller.signal,
        })

        if (!result.url || !result.fileId) {
          throw new Error(ERROR_RESPUESTA_INVALIDA)
        }

        if (mountedRef.current) setProgress(100)

        return { url: result.url, fileId: result.fileId }
      } catch (uploadError) {
        const message = getUploadErrorMessage(uploadError)
        if (mountedRef.current) setError(message)
        throw new Error(message)
      } finally {
        if (mountedRef.current) setIsUploading(false)
        controllerRef.current = null
      }
    },
    [],
  )

  return { uploadFile, isUploading, progress, error }
}
