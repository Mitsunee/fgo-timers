import YAML from "yaml";
import { parseDate } from "./parseDate";
import { parseEventTime } from "./parseEventTime";

export function parseEvent(event) {
  const { date, times, ...props } = YAML.parse(event);
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
