import spacetime from "spacetime";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";

import { getCurrentTime } from "../utils/getCurrentTime";
import { parseTicketData } from "../utils/parseTicketData";

export async function generateLoginTicketData() {
  const now = spacetime.now(getCurrentTime() * 1000, "America/Los_Angeles");
  const currentYear = now.year();
  const currentMonth = now.format("month-short");

  // fetch and parse ticket data
  const data = await readFileYaml(
    `assets/data/login-tickets${currentYear}.yml`
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
  let next = now.next("month").time("20:00", true);
  if (next.isDST()) next = next.add(1, "hour");
  next = Math.trunc(next.epoch / 1000);

  return { items, next };
}
