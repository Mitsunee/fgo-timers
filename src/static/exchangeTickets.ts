import path from "path";
import type { BundledExchangeTicket } from "~/items/types";
import { BundleFile } from "./Bundle";

const filePath = path.join(
  process.cwd(),
  "assets/static/exchange_tickets.json"
);
export const LoginTicketsFile = new BundleFile<BundledExchangeTicket[]>({
  name: "Exchange Tickets",
  filePath
});

/**
 * Reads Exchange Ticket bundle
 * @returns Bundled data
 */
export const getBundledTickets =
  LoginTicketsFile.readBundle.bind(LoginTicketsFile);

/**
 * Writes to Exchange Ticket bundle
 * @param data Array of bundled Exchange Tickets
 * @returns FileWriteResult
 */
export const writeBundledTickets =
  LoginTicketsFile.writeBundle.bind(LoginTicketsFile);
