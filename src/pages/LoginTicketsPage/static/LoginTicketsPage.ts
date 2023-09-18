import spacetime from "spacetime";
import type { InferGetStaticPropsType } from "next";
import { createItemRecord } from "~/static/data/items";
import { getBundledTickets } from "~/static/exchangeTickets";
import { msToSeconds } from "~/time/msToSeconds";
import { Global } from "~/types/enum";
import { Log } from "~/utils/log";

export async function getStaticProps() {
  const tickets = await getBundledTickets();
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
  const items = await createItemRecord(
    new Set<number>([...currentTicket.items, ...(nextTicket?.items || [])])
  );

  const props = {
    currentTicket,
    nextTicket,
    years,
    items
  } as const;

  return { props };
}

export type LoginTicketsPageProps = InferGetStaticPropsType<
  typeof getStaticProps
>;
