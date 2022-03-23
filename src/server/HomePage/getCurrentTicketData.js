import { readStaticBundle } from "../utils/static";
import { tsToSpacetime } from "../utils/time";
import { createServerError } from "../utils/createServerError";

export async function getCurrentTicketData(now) {
  const ticketsData = await readStaticBundle("loginTickets");
  const s = tsToSpacetime(now, "America/Los_Angeles");
  const data = ticketsData[s.year()][s.format("month-short")];

  if (!data) {
    throw createServerError("Could not find data for current Login Ticket");
  }

  return data;
}
