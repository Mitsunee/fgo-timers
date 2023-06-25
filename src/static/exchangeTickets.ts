import path from "path";
import type { BundledLoginTicket } from "~/items/types";
import { BundleFile } from "./Bundle";

export const name = "Exchange Tickets";
export const filePath = path.join(
  process.cwd(),
  "assets/static/exchange_tickets.json"
);
export const File = new BundleFile<BundledLoginTicket[]>(filePath);

/**
 * Reads Exchange Ticket bundle
 * @returns Bundled data
 */
export const getBundledTickets = File.readFile.bind(File);

/**
 * Writes to Exchange Ticket bundle
 * @param data Array of bundled Exchange Tickets
 * @returns FileWriteResult
 */
export const writeBundledTickets = File.writeFile.bind(File);
