import type { BundledExchangeTicket } from "~/items/types";
import { getTicketYear } from "./getTicketYear";

export function getTicketsYears(tickets: BundledExchangeTicket[]) {
  const years = tickets.map(ticket => getTicketYear(ticket));

  return Array.from(new Set(years)).sort((a, b) => a - b);
}
