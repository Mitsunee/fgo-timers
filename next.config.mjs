/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  swcMinify: true,
  experimental: {
    legacyBrowsers: false,
    newNextLinkBehavior: true
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "static.atlasacademy.io" }]
  }
};

export default config;
