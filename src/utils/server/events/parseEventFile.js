import { readFileYaml } from "@foxkit/node-util/fs-yaml";

import { parseDate } from "./parseDate";
import { parseEventTime } from "./parseEventTime";

export async function parseEventFile(filePath) {
  const { date, times, ...props } = await readFileYaml(filePath);
  const [startsAt, endsAt] = parseDate(date, true);

  const eventParsed = {
    ...props,
    startsAt
  };

  if (endsAt) {
    eventParsed.endsAt = endsAt;
  }

  if (times) {
    eventParsed.times = times.map(parseEventTime);
  }

  return eventParsed;
}
