/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    ],
  },
}

module.exports = nextConfig
