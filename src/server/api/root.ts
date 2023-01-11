import { createTRPCRouter } from "./trpc";
import { upgradesRouter } from "./routers/upgrades";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  upgrades: upgradesRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
