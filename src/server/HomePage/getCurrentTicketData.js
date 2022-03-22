import spacetime from "spacetime";

import { readStaticBundle } from "../utils/static";
import { createServerError } from "../utils/createServerError";

export async function getCurrentTicketData() {
  const ticketsData = await readStaticBundle("loginTickets");
  const now = spacetime.now().goto("America/Los_Angeles");
  const data = ticketsData[now.year()][now.format("month-short")];

  if (!data) {
    throw createServerError("Could not find data for current Login Ticket");
  }

  return data;
}
