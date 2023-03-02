/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  swcMinify: true,
  experimental: {
    legacyBrowsers: false,
    newNextLinkBehavior: true,
    outputFileTracingIncludes: {
      "/events/[slug]/banners": [
        "assets/static/events.json",
        "assets/static/data/servants.json",
        "assets/static/data/ces.json"
      ],
      "/events/[slug]/upgrades": [
        "assets/static/events.json",
        "assets/static/data/servants.json",
        "assets/static/data/ces.json"
      ],
      "/events/[slug]": [
        "assets/static/events.json",
        "assets/static/data/servants.json",
        "assets/static/data/ces.json"
      ],
      "/exchange-tickets/[year]": ["assets/static/loginTickets.json"],
      "/": [
        "assets/static/backgrounds.json",
        "assets/static/events.json",
        "assets/static/loginTickets.json",
        "assets/static/prismShops.json",
        ".next/cache/atlasacademy/info.json",
        ".next/cache/atlasacademy/NA/nice_master_mission.json"
      ]
    }
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "static.atlasacademy.io" }]
  }
};

export default config;
