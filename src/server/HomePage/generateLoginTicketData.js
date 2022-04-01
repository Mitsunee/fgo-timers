import spacetime from "spacetime";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";

import { getCurrentTime } from "../utils/getCurrentTime";
import { parseTicketData } from "../utils/parseTicketData";

export async function generateLoginTicketData() {
  let now = spacetime(getCurrentTime() * 1000, "etc/utc");
  if (now.hour24() < 4) {
    // if it's before 4am travel back to yesterday
    now = now.subtract(12, "hours");
  }

  const currentYear = now.year();
  const currentMonth = now.format("month-short");

  // fetch and parse ticket data
  const data = await readFileYaml(
    `assets/data/login-tickets/${currentYear}.yml`
  );
  if (!data || !data[currentMonth]) {
    throw new Error(`Couldn't find Login Ticket data for year ${currentYear}`);
  }
  if (!data[currentMonth]) {
    throw new Error(
      `Couldn't find Login Ticket data for month ${currentMonth} in year ${currentYear}`
    );
  }
  const items = await parseTicketData(data[currentMonth]);

  // find next reset
  const next = Math.trunc(now.next("month").time("4am").epoch / 1000);

  return { items, next };
}
