export const navRoutes = [
  { link: "/", text: "Home", test: /^\/$/ },
  { link: "/timers", text: "Timers" },
  { link: "/events", text: "Events" },
  {
    link: [
      { link: "/upgrades", text: "Future Upgrades", test: /^\/upgrades\/?$/ },
      { link: "/upgrades/interludes", text: "All Interludes" },
      { link: "/upgrades/rankups", text: "All Rank Ups" }
    ],
    text: "Upgrades",
    test: /^\/upgrades/,
    key: "upgrades"
  }
];
