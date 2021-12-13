const config = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: "/events/xmas-2021-temp",
        destination: "/events/xmas-2021",
        permanent: false
      }
    ];
  }
};

export default config;
