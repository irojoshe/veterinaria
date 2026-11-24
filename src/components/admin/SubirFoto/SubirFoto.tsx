'use client'

import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react'
import { useImageKitUpload } from '@/hooks/useImageKitUpload'

interface Props {
  currentUrl?: string | null
  onUploaded: (url: string, fileId: string) => void
  label?: string
}

/**
 * Native file picker that uploads the selected image straight to ImageKit.
 * The parent form receives the public URL and the ImageKit file id.
 */
export default function SubirFoto({
  currentUrl,
  onUploaded,
  label = 'Imagen',
}: Props) {
  const { uploadFile, isUploading, progress, error } = useImageKitUpload()
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentUrl ?? null,
  )
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const inputId = useId()

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const objectUrl = URL.createObjectURL(file)
    objectUrlRef.current = objectUrl
    setPreviewUrl(objectUrl)

    try {
      const result = await uploadFile(file)
      setUploadedUrl(result.url)
      onUploaded(result.url, result.fileId)
    } catch {
      // The hook already exposes the error message.
    }
  }

  const displayedUrl = uploadedUrl ?? previewUrl

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-13 font-semibold text-text-main">
        {label}
      </label>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        aria-label="Seleccionar imagen"
        disabled={isUploading}
        onChange={handleChange}
        className="w-full text-12 text-text-main file:mr-3 file:rounded-md
                   file:border-0 file:bg-primary file:px-3 file:py-2
                   file:text-12 file:font-semibold file:text-white
                   cursor-pointer rounded-md bg-background-surface
                   border border-border outline-none focus:ring-2 focus:ring-primary
                   disabled:cursor-not-allowed disabled:opacity-60"
      />

      {displayedUrl && (
        // Plain img: the preview can be a local blob URL that next/image rejects.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displayedUrl}
          alt={`Previsualización de ${label.toLowerCase()}`}
          className="h-32 w-full max-w-64 rounded-md object-cover
                     border border-border bg-background-surface"
        />
      )}

      {isUploading && (
        <div className="flex flex-col gap-1">
          <div
            role="progressbar"
            aria-label="Progreso de la subida"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 w-full overflow-hidden rounded-full
                       bg-background-surface border border-border"
          >
            <div
              className="h-full bg-primary transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-11 text-text-muted">Subiendo… {progress}%</p>
        </div>
      )}

      {error && (
        <p role="alert" className="text-12 text-status-cancelled">
          {error}
        </p>
      )}

      {!isUploading && !error && uploadedUrl && (
        <p role="status" className="text-12 text-status-confirmed">
          Imagen subida correctamente.
        </p>
      )}
    </div>
  )
}
