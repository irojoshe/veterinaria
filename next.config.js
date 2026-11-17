/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Las fotos de los servicios vienen de URLs externas guardadas en la DB.
    remotePatterns: [
      { protocol: 'https', hostname: 'loremflickr.com' },
      { protocol: 'https', hostname: '**.loremflickr.com' },
      { protocol: 'https', hostname: 'www.veterinariadogtor.com' },
      { protocol: 'https', hostname: 'indyvetcare.com' },
      { protocol: 'https', hostname: 'cdn.whole-dog-journal.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
    ],
  },
}

module.exports = nextConfig
