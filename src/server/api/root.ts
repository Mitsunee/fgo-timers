import path from "path";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { eventsRouter } from "./routers/events";
import { upgradesRouter } from "./routers/upgrades";
import { createTRPCRouter } from "./trpc";

/**
 * This is just here to convince node file trace that we need this folder
 */
path.join(process.cwd(), "assets/static");

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  upgrades: upgradesRouter,
  events: eventsRouter
});

/**
 * SSG adapter for app router. For client use `import { api } from "src/client/api"` instead
 */
export const serverApi = createServerSideHelpers({
  router: appRouter,
  ctx: {}
});

// export type definition of API
export type AppRouter = typeof appRouter;
