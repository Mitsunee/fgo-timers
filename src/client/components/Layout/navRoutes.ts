export type NavRoute = {
  route: string;
  label: string;
};

export const navRoutes: NavRoute[] = [
  { route: "/", label: "Timers" },
  { route: "/events", label: "Events" },
  {
    route: `/exchange-tickets`,
    label: "Exchange Tickets"
  },
  { route: "/upgrades", label: "Upgrades" },
  { route: "/ap-calc", label: "AP Calculator" }
];

/**
 * Compares nav items against route
 * @param item NavRoute to check against the current route
 * @param currentRoute {String} pass `router.route` from `useRouter()`
 * @returns boolean
 */
export function isActiveRoute(item: NavRoute, currentRoute: string): boolean {
  if (item.route == "/") {
    return currentRoute == "/";
  }
  return currentRoute.startsWith(item.route);
}
