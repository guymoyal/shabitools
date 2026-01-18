/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Cloudflare Pages compatibility
  output: 'standalone',
  // Optimize for Cloudflare
  compress: true,
  // Image optimization (Cloudflare supports Next.js Image component)
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
