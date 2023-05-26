import type { BundledLoginTicket } from "~/items/types";
import { getTicketYear } from "./getTicketYear";

export function getTicketsYears(tickets: BundledLoginTicket[]) {
  const years = tickets.map(ticket => getTicketYear(ticket));

  return Array.from(new Set(years)).sort((a, b) => a - b);
}
