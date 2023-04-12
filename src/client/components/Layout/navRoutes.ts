export type NavRoute = {
  route: string;
  label: string;
  test?: RegExp;
};

export const navRoutes: NavRoute[] = [
  { route: "/", label: "Timers", test: /^\/$/ },
  { route: "/events", label: "Events", test: /^\/events.*/ },
  {
    route: `/exchange-tickets`,
    label: "Login Exchange Tickets"
  },
  { route: "/upgrades", label: "Upgrades" },
  { route: "/ap-calc", label: "AP Calculator" }
];
