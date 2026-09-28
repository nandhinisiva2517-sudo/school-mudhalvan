/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: { serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"] },
  images: { domains: ["lh3.googleusercontent.com"] },
  compress: true,
  swcMinify: true,
};
module.exports = nextConfig;
