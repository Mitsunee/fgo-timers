import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { toBasicEvent } from "src/events/toBasicEvent";
import type { BundledEvent } from "src/events/types";
import { getBundledEvents } from "src/utils/getBundles";
import { getBuildInfo } from "src/utils/getBuildInfo";

async function createEventActiveFilter(now?: number) {
  const date = now ?? (await getBuildInfo()).date;
  return (event: BundledEvent) => date < event.hideAt;
}

async function createEventInactiveFilter(now?: number) {
  const date = now ?? (await getBuildInfo()).date;
  return (event: BundledEvent) => date >= event.hideAt;
}

const zInput = z.object({
  limit: z.number().optional(),
  exclude: z.enum(["active", "inactive"]).optional(),
  now: z.number().optional()
});

export const eventsRouter = createTRPCRouter({
  basic: publicProcedure.input(zInput).query(async ({ input }) => {
    const { limit, now } = input;
    const [eventList, isNotActive, isActive] = await Promise.all([
      getBundledEvents(),
      createEventInactiveFilter(now),
      createEventActiveFilter(now)
    ]);

    let filter: typeof isActive | undefined = undefined;
    if (input.exclude == "active") filter = isNotActive;
    if (input.exclude == "inactive") filter = isActive;

    return (filter ? eventList.filter(filter) : eventList)
      .slice(0, limit)
      .map(toBasicEvent);
  }),
  full: publicProcedure.input(zInput).query(async ({ input }) => {
    const { limit, now } = input;
    const [eventList, isNotActive, isActive] = await Promise.all([
      getBundledEvents(),
      createEventInactiveFilter(now),
      createEventActiveFilter(now)
    ]);

    let filter: typeof isActive | undefined = undefined;
    if (input.exclude == "active") filter = isNotActive;
    if (input.exclude == "inactive") filter = isActive;

    return (filter ? eventList.filter(filter) : eventList).slice(0, limit);
  })
});
