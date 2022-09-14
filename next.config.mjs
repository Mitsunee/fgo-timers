const config = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    browsersListForSwc: true,
    legacyBrowsers: false,
    newNextLinkBehavior: true
  }
};

export default config;
