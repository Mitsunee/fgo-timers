import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "src/server/api/root";
import { createTRPCContext } from "src/server/api/trpc";
import { Log } from "src/utils/log";

// see src/server/api/root.ts for routers
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
          Log.error(
            `[tRPC] ${error.message} ${Log.styleParent(path || "<no-path>")}`
          );
        }
      : undefined
});
