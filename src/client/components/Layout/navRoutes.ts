import spacetime from "spacetime";

const currentYear = spacetime.now().year(); // BUG: Hydration missmatch (won't fix, as new index page will take over the link)

export type NavRoute = {
  route: string;
  label: string;
  test?: RegExp;
};

export const navRoutes: NavRoute[] = [
  { route: "/", label: "Timers", test: /^\/$/ },
  {
    route: `/exchange-tickets/${currentYear}`,
    label: "Login Exchange Tickets",
    test: /^\/exchange-tickets\/\d+\/?$/
  },
  { route: "/upgrades", label: "Upgrades" },
  { route: "/ap-calc", label: "AP Calculator" }
];
