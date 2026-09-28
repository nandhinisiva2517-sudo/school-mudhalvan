/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: { serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"] },
  images: { domains: ["lh3.googleusercontent.com"] },
  compress: true,
  swcMinify: true,
  // Ensure all pages that depend on env vars are not prerendered at build time
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
  },
};
module.exports = nextConfig;
