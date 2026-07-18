/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["edge-tts-universal", "ws"],
  },
};

module.exports = nextConfig;