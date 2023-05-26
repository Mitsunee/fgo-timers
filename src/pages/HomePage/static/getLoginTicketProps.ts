import { getBundledLoginTickets } from "~/utils/getBundles";
import { Log } from "~/utils/log";

export async function getLoginTicketProps(now: number) {
  const tickets = await getBundledLoginTickets();
  let ticket = tickets.find(ticket => ticket.start <= now && ticket.next > now);

  if (!ticket) {
    ticket = tickets[tickets.length - 1];
    Log.warn("using last ticket in bundled data as fallback");
    Log.table({ now, ...ticket });
  }

  return ticket;
}
