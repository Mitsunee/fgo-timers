import { readFile } from "fs/promises";
import YAML from "yaml";
import { parseDate } from "./parseDate";
import { parseEventTime } from "./parseEventTime";

export async function parseEventFile(filePath) {
  const fileContent = await readFile(filePath, "utf8");
  const { date, times, ...props } = YAML.parse(fileContent);
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
