import spacetime from "spacetime";

const currentYear = spacetime.now().year(); // BUG: Hydration missmatch (won't fix, as new index page will take over the link)

export const navRoutes = [
  { link: "/", text: "Timers", test: /^\/$/ },
  {
    link: `/exchange-tickets/${currentYear}`,
    text: "Login Exchange Tickets",
    test: /^\/exchange-tickets\/\d+\/?$/
  },
  { link: "/upgrades", text: "Upgrades" },
  { link: "/ap-calc", text: "AP Calculator" }
];
