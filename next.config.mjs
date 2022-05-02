const config = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  async redirects() {
    return [
      {
        source: "/events/17m-downloads-campaign",
        destination: "/events/17m-ssr-ticket",
        permanent: false
      }
    ];
  }
};

export default config;
