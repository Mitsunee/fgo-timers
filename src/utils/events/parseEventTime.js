import { parseDate } from "./parseDate";

export function parseEventTime(time) {
  const { date, times, ...props } = time;

  const timeParsed = {
    ...props
  };

  if (date) {
    const [startsAt, endsAt] = parseDate(date, true);
    timeParsed.startsAt = startsAt;
    if (endsAt) {
      timeParsed.endsAt = endsAt;
    }
  } else {
    timeParsed.times = times.map(({ title, date }) => ({
      title,
      startsAt: parseDate(date)
    }));
  }

  return timeParsed;
}
