import spacetime from "spacetime";
import { Global } from "~/types/enum";
import type { BundledExchangeTicket } from "~/items/types";

export function getTicketYear(ticket: BundledExchangeTicket) {
  return spacetime(ticket.start * 1000, Global.UTC_TZ).year();
}
