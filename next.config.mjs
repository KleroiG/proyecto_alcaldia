/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  allowedDevOrigins: ['172.21.0.1', 'localhost'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com', // Enlaces compartidos normales de Drive
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Enlaces directos que genera la API de Google
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // El enlace temporal que usamos arriba
      }
    ],
  },

}

export default nextConfig