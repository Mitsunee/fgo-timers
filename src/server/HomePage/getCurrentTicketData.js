import spacetime from "spacetime";
import { readFileJson } from "@foxkit/node-util/fs";

import { createServerError } from "../utils/createServerError";

export async function getCurrentTicketData() {
  const ticketsData = await readFileJson("assets/static/loginTickets.json");
  const now = spacetime.now().goto("America/Los_Angeles");
  const data = ticketsData[now.year()][now.format("month-short")];

  if (!data) {
    throw createServerError("Could not find data for current Login Ticket");
  }

  return data;
}
