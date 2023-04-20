import spacetime from "spacetime";
import type { InferGetStaticPropsType } from "next";
import { msToSeconds } from "src/time/msToSeconds";
import {
  getBundledItemMap,
  getBundledLoginTickets
} from "src/utils/getBundles";
import { Global } from "src/types/enum";
import { Log } from "src/utils/log";
import type { BundledItem } from "src/items/types";
import type { DataMap } from "src/client/contexts";

export async function getStaticProps() {
  const [tickets, itemMap] = await Promise.all([
    getBundledLoginTickets(),
    getBundledItemMap()
  ]);
  const s = spacetime.now(Global.UTC_TZ);
  const now = msToSeconds(s.epoch);
  const years = tickets.reduce(
    (result, ticket) => {
      const val = spacetime(ticket.start * 1000, Global.UTC_TZ).year();
      if (val < result.min) result.min = val;
      if (val > result.max) result.max = val;
      return result;
    },
    { min: s.year(), current: s.year(), max: s.year() }
  );
  let currentTicketIdx = tickets.findIndex(
    ticket => ticket.start <= now && ticket.next > now
  );

  if (currentTicketIdx < 0) {
    currentTicketIdx = tickets.length - 1;
    Log.warn("using last ticket in bundled data as fallback");
    Log.table({ now, ...tickets[currentTicketIdx] });
  }

  const currentTicket = tickets[currentTicketIdx];
  const nextTicket = tickets.find(ticket => ticket.start == currentTicket.next);
  const items: DataMap<BundledItem> = {};
  const itemsSeen = new Set<number>([
    ...currentTicket.items,
    ...(nextTicket?.items || [])
  ]);

  for (const itemId of itemsSeen) {
    items[itemId] ||= itemMap[itemId];
  }

  const props = {
    currentTicket,
    nextTicket,
    years,
    items
  } as const;

  return { props, revalidate: 18000 };
}

export type LoginTicketsPageProps = InferGetStaticPropsType<
  typeof getStaticProps
>;
