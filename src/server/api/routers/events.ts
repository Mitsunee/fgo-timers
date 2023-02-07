import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { getBundledEvents } from "src/utils/getBundles";
import { toBasicEvent } from "src/events/toBasicEvent";

export const eventsRouter = createTRPCRouter({
  basic: publicProcedure
    .input(
      z.object({
        limit: z.number().optional()
      })
    )
    .query(async ({ input }) => {
      const { limit } = input;
      const eventList = await getBundledEvents();

      return eventList.slice(0, limit).map(toBasicEvent);
    })
});
