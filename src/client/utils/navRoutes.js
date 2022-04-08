import spacetime from "spacetime";

const currentYear = spacetime.now().year();

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
