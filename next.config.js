/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Esto quita el warning de "Blocked cross-origin request" en tu red local
  allowedDevOrigins: ['10.2.0.2'],
  images: {
    // Las fotos de los servicios vienen de URLs externas guardadas en la DB.
    remotePatterns: [
      // Servicios
      { protocol: 'https', hostname: 'www.veterinariadogtor.com' },
      { protocol: 'https', hostname: 'indyvetcare.com' },
      { protocol: 'https', hostname: 'cdn.whole-dog-journal.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'loremflickr.com' },
      { protocol: 'https', hostname: '**.loremflickr.com' },
      // Mascotas
      { protocol: 'https', hostname: 'irp.cdn-website.com' },
      { protocol: 'https', hostname: 'www.petful.com' },
      { protocol: 'https', hostname: 'conejosenanossiero.com' },
      { protocol: 'https', hostname: 'clinicaveterinarium.es' },
      // CloudFront (fotos subidas por clientes/admin)
      { protocol: 'https', hostname: '**.cloudfront.net' },
      // Google rota entre tbn0..tbn3 segun el resultado; el comodin cubre todos.
      { protocol: 'https', hostname: '**.gstatic.com' },

      // 🔥 ESTO ES LO QUE FALTABA (Las fotos de mascotas de Unsplash)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;
