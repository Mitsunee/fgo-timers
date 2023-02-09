import { createTRPCRouter } from "./trpc";
import { upgradesRouter } from "./routers/upgrades";
import { eventsRouter } from "./routers/events";
import path from "path";

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

// export type definition of API
export type AppRouter = typeof appRouter;
