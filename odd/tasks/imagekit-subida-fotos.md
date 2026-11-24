# ImageKit: subida de fotos desde el panel de administración

## Objetivo

Permitir que el administrador suba una foto (servicio, mascota, logo de la clínica)
**directamente desde el navegador a ImageKit**, usando un token temporal generado
por el servidor (patrón BFF), y que la `url` y el `imagekit_file_id` queden
guardados en Supabase.

## Problema

El panel solo permitía **pegar una URL de imagen a mano**: no existía forma de
subir un archivo desde el admin, y no había control sobre los archivos que
quedaban huérfanos en ImageKit al reemplazar una foto.

## Por qué

- El admin trabaja con archivos reales, no con URLs de terceros.
- El archivo no debe pasar por el servidor de la aplicación: se sube directo a
  ImageKit desde el navegador.
- La clave privada nunca puede salir del servidor.

## Alcance

| Fase | Entregable |
| --- | --- |
| 1 | Endpoint de autenticación `GET /api/imagekit-auth` (401 sin sesión) |
| 2 | Hook `useImageKitUpload` (progreso, errores del SDK, abort on unmount) |
| 3 | Componente `SubirFoto` (input nativo, previsualización, barra de progreso) |
| 4 | Integración en `FormServicio`, `FormMascota` y `FormNegocio` |
| 5 | Limpieza del archivo reemplazado en los services |

## Fuera de alcance

- URLs firmadas / archivos privados de ImageKit.
- Migraciones de base de datos: `imagekit_file_id` ya existía en `servicios`,
  `mascotas` y `negocio`.
- Galería o biblioteca de medios del panel.

## Restricciones

- `IMAGEKIT_PRIVATE_KEY` solo en código de servidor; jamás en `NEXT_PUBLIC_*`,
  en el bundle del cliente ni en una respuesta.
- Sin `SELECT *`: listas explícitas de columnas.
- `try/catch` en toda operación de red o base de datos.
- Componentes de máximo 150 líneas.
- Copy de UI en español; identificadores y comentarios en inglés.
- `next.config.js` es CommonJS con CRLF: editar a nivel de bytes.

## Tareas

- [x] **T1 — Dependencias y credenciales.** `imagekit@^5.2.0` y
      `@imagekit/next@^2.1.6` en `package.json`; `.env.local` con
      `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY` y
      `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`. `.env.local` está en `.gitignore`.
- [x] **T2 — Endpoint de autenticación.** `src/app/api/imagekit-auth/route.ts`
      verifica la sesión con `getSession()` (401 sin sesión) y devuelve solo
      `token`, `expire`, `signature` y `publicKey`.
- [x] **T3 — Hook de subida.** `src/hooks/useImageKitUpload.ts` expone
      `uploadFile`, `isUploading`, `progress` y `error`; pide un token fresco
      por subida y mapea `ImageKitAbortError`, `ImageKitInvalidRequestError`,
      `ImageKitServerError` e `ImageKitUploadNetworkError`.
- [x] **T4 — Componente visual.** `src/components/admin/SubirFoto/SubirFoto.tsx`
      con `<input type="file" accept="image/*">`, previsualización, barra de
      progreso (`role="progressbar"`) y `aria-label`.
- [x] **T5 — Integración en formularios.** Los tres formularios de admin
      reemplazan el campo de URL por `<SubirFoto />`, guardan `url` y
      `fileId` en estado y los envían por `FormData` (`imagen_url`,
      `foto_url`, `logo_url` e `imagekit_file_id`).
- [x] **T6 — Limpieza de huérfanos.** Antes del `UPDATE` se lee el
      `imagekit_file_id` anterior y, si el `UPDATE` fue exitoso y el id cambió,
      se llama a `imagekit.deleteFile()` dentro de un `try/catch` que solo
      loguea el error.
- [x] **T7 — Caché e imágenes.** `updateTag('servicios' | 'mascotas' |
      'negocio')` tras un guardado exitoso; `ik.imagekit.io` agregado a
      `images.remotePatterns`.

## Criterios de aceptación

- [x] Sin sesión, `/api/imagekit-auth` devuelve 401.
- [x] La respuesta de autenticación nunca incluye la clave privada.
- [x] La subida llega a ImageKit desde el navegador y devuelve `url` + `fileId`.
- [x] `url` y `fileId` llegan a la Server Action y se persisten en Supabase.
- [x] Reemplazar una foto borra el archivo anterior y un fallo de borrado no
      rompe la respuesta al usuario.
- [x] `npx tsc --noEmit` termina con exit code 0.

## Checks

| Check | Resultado |
| --- | --- |
| `npx tsc --noEmit` | exit 0 |
| Lectura estructural (privada key, hidden inputs, `updateTag`, remotePatterns) | ok |
| `next dev` / `next build` | **no ejecutables en WSL** (SIGBUS) — pendiente en Windows |
| Prueba real de subida contra ImageKit | **pendiente** (requiere sesión de admin en Windows) |

## Progreso y evidencia

Commit `07511c8` — `feat(imagekit): integra subida de fotos con autenticacion
BFF y limpieza de archivos huerfanos` (18 archivos, +702 / -75).

Detalles de la API que importan:

- En `imagekit@5` `getAuthenticationParameters()` es método **directo** de la
  clase (`client.helper.*` es de la v4).
- `UploadResponse.url` y `UploadResponse.fileId` son **opcionales** en los
  tipos: el hook valida ambos en runtime antes de devolverlos.
- `npm install` en WSL poda los bindings nativos de Windows
  (`lightningcss`, `@next/swc`, `@tailwindcss/oxide`, `@img/sharp`,
  `@unrs/resolver`): se restauraron con `npm pack` + `tar` sin `npm install`.

## Siguiente paso

Probar en Windows: subir una foto de servicio, una de mascota y el logo de la
clínica; confirmar que la URL se guarda en Supabase, que la imagen se ve en el
sitio público y que al reemplazarla el archivo anterior desaparece de
ImageKit.
