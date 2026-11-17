/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Las fotos de los servicios vienen de URLs externas guardadas en la DB.
    remotePatterns: [
      { protocol: 'https', hostname: 'loremflickr.com' },
      { protocol: 'https', hostname: '**.loremflickr.com' },
    ],
  },
}

module.exports = nextConfig
