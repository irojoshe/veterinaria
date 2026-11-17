# Imágenes externas

Regla del proyecto: **toda imagen que venga de un dominio externo debe estar permitida en `images.remotePatterns`** (`next.config.js`). Sin esa entrada, `next/image` rechaza la URL en runtime.

## Por qué importa

Next Image no descarga ni valida la imagen al compilar: valida el **hostname en el momento de Optimizer la sirve**. Consecuencias:

- `npm run build` **pasa igual** aunque falte un host: el error aparece en runtime, como un 400 en la URL `_next/image`.
- Una foto de servicio que "no aparece" en la web puede no ser un problema de la base, sino un host no permitido.

## Síntoma → causa → solución

| Síntoma | Causa | Solución |
| --- | --- | --- |
| `400 - "hostname ... is not configured under images"` | El host no está en `remotePatterns` | Agregar el host |
| La imagen no carga pero el resto de la página sí | Host no permitido o URL mal formada | Revisar la URL completa de la base |
| `404` en `/_next/image?url=...` | El archivo no existe en `public/` o la URL remota died | Verificar la ruta y el estado del recurso |

## Hosts permitidos

| Host | Origen | Nota |
| --- | --- | --- |
| `loremflickr.com` y `**.loremflickr.com` | `imagen_url` de los servicios en Supabase | Fotos de servicio del catálogo |
| `www.veterinariadogtor.com` | Contenido editorial de la clínica | |
| `indyvetcare.com` | Contenido editorial de la clínica | |
| `cdn.whole-dog-journal.com` | Contenido editorial de la clínica | |
| `encrypted-tbn0.gstatic.com` y `**.gstatic.com` | Miniaturas de Google | El comodin cubre `tbn0`..`tbn3`, entre los que Google rota según el resultado |

## Cómo agregar un host

```js
// next.config.js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'nuevo-dominio.com' },
    // Subdominios: el prefijo ** cubre cualquier nivel.
    { protocol: 'https', hostname: '**.nuevo-dominio.com' },
  ],
}
```

Reglas:

- Un solo patrón por host. `**` al inicio cubre cualquier subdominio.
- Especifica siempre `protocol`: no se permite `http` implícito.
- El proyecto usa **CommonJS**: `module.exports = nextConfig`. No usar `export default`, Next deja de leer la configuración.
- Comentá de dónde sale cada host: los patrones se acumulan sin contexto y nadie sabe qué imagen los necesita.

## Verificación

El build no valida los hosts. La comprobación real es en runtime:

1. Levantar la app (`npm run dev` o `npm run build && npm start`).
2. Cargar cada imagen externa.
3. Confirmar que responde `200` la URL `/_next/image?url=...` y que en la consola del navegador no aparece `hostname ... is not configured`.

Referencia: `next.config.js` → `images.remotePatterns`.
