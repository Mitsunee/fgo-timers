import spacetime from "spacetime";
import { Global } from "~/types/enum";
import type { BundledLoginTicket } from "~/items/types";

export function getTicketYear(ticket: BundledLoginTicket) {
  return spacetime(ticket.start * 1000, Global.UTC_TZ).year();
}
