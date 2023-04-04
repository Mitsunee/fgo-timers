import spacetime from "spacetime";
import { Global } from "src/types/enum";
import type { BundledLoginTicket } from "src/items/types";

export function getTicketYear(ticket: BundledLoginTicket) {
  return spacetime(ticket.start * 1000, Global.UTC_TZ).year();
}
