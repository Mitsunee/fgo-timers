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

export async function getStaticProps() {
  const [tickets, itemMap] = await Promise.all([
    getBundledLoginTickets(),
    getBundledItemMap()
  ]);
  const s = spacetime.now(Global.UTC_TZ);
  const now = msToSeconds(s.epoch);
  const currentYear = s.year();
  const currentYearTickets = tickets.filter(
    ticket =>
      spacetime(ticket.start * 1000, Global.UTC_TZ).year() == currentYear
  );
  let currentTicketIdx = currentYearTickets.findIndex(
    ticket => ticket.start <= now && ticket.next > now
  );

  if (currentTicketIdx < 0) {
    currentTicketIdx = currentYearTickets.length - 1;
    Log.warn("using last ticket in bundled data as fallback");
    Log.table({ now, ...currentYearTickets[currentTicketIdx] });
  }

  const currentTicket = currentYearTickets[currentTicketIdx];
  const isLastTicket = currentTicketIdx + 1 == currentYearTickets.length;
  const nextTicket = isLastTicket
    ? tickets.find(ticket => ticket.start == currentTicket?.next) || -1
    : currentTicketIdx + 1;

  const items: Record<number, BundledItem> = {};

  const itemsSeen = new Set<number>([
    ...currentYearTickets.flatMap(ticket => ticket.items),
    ...(typeof nextTicket == "number" ? [] : nextTicket.items)
  ]);
  for (const itemId of Array.from(itemsSeen)) {
    items[itemId] ||= itemMap[itemId];
  }

  const props = {
    updatedAt: now,
    /**
     * Array of ticket data for all tickets in the current year
     */
    tickets: currentYearTickets,
    /**
     * Index to current ticket in `tickets`
     */
    current: currentTicketIdx,
    /**
     * Index to next ticket or ticket data if it's in the next year.
     * **Note:** Index may be -1 if end of available data has been reached!
     */
    next: nextTicket,
    /**
     * Map of all items used in tickets in current year (and next january if applicable).
     */
    items
  } as const;

  return { props, revalidate: 86400 };
}

export type LoginTicketsPageProps = InferGetStaticPropsType<
  typeof getStaticProps
>;
