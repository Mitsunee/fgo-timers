//import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { initTRPC } from "@trpc/server";

//type CreateContextOptions = Record<string, never>;

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = (/* _opts: CreateContextOptions */) => {
  return {};
};

/**
 * tRPC router context
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = (/* _opts: CreateNextContextOptions */) => {
  return createInnerTRPCContext(/* {} */);
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter({ shape }) {
    return shape;
  }
});

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 */
export const publicProcedure = t.procedure;
