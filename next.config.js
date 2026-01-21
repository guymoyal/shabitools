/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Static Site Generation (SSG) for Cloudflare Pages
  output: 'export',
  // Optimize for Cloudflare
  compress: true,
  // Image optimization - Note: Next.js Image component requires optimization server
  // For static export, use regular img tags or unoptimized images
  images: {
    unoptimized: true,
  },
  // Trailing slash for better Cloudflare Pages compatibility
  trailingSlash: false,
}

module.exports = nextConfig
