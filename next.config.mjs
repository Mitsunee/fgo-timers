/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    browsersListForSwc: true,
    legacyBrowsers: false,
    newNextLinkBehavior: true
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "static.atlasacademy.io" }]
  }
};

export default config;
