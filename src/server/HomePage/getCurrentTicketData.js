import { readStaticBundle } from "../utils/static";
import { tsToSpacetime } from "../utils/time";
import { createServerError } from "../utils/createServerError";

export async function getCurrentTicketData(now) {
  const ticketsData = await readStaticBundle("loginTickets");
  let s = tsToSpacetime(now, "etc/utc");
  if (s.hour24() < 4) {
    s = s.subtract(12, "hours");
  }

  const currentYear = s.year();
  const currentMonth = s.format("month-short");
  const data = ticketsData[currentYear][currentMonth];
  if (!data) {
    throw createServerError(
      `Couldn't find Login Ticket data for ${currentMonth} ${currentYear}`
    );
  }

  // find next reset
  const next = Math.trunc(now.next("month").time("4am").epoch / 1000);

  return { next, data };
}
