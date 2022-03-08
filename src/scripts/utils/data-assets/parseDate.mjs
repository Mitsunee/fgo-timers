import spacetime from "spacetime";

const tzOffset = new Map([
  ["PST", "-08:00"],
  ["PDT", "-07:00"]
]);

function toTimestamp({ date, time, timezone }) {
  const s = spacetime(`${date}T${time}:00${tzOffset.get(timezone)}`);

  return Math.trunc(s.epoch / 1000);
}

export function parseDate(date, { allowDuration = true, flat = false } = {}) {
  if (date.includes(" - ")) {
    // date is a duration
    if (!allowDuration) {
      throw new TypeError(
        `Expected date ${date} to Date but received Duration`
      );
    }

    let [start, end] = date.split(" - ").map(str => str.trim());
    if (!start.endsWith("PST") && !start.endsWith("PDT")) {
      // start Date has no own timezone
      start = `${start} ${end.slice(-3)}`;
    }
    if (!/^\d{4}/.test(end)) {
      // end Date has no own year
      end = `${start.slice(0, 4)}-${end}`;
    }

    start = parseDate(start, { allowDuration: false, flat: true });
    end = parseDate(end, { allowDuration: false, flat: true });

    return [start, end];
  }

  const match = date.match(
    /^(?<date>\d{4}-\d{2}-\d{2}) (?<time>\d{2}:\d{2}) (?<timezone>P[DS]T)$/i
  );
  if (!match) {
    throw new Error(`Couldn't parse Date '${date}'`);
  }
  const result = toTimestamp(match.groups);

  return flat ? result : [result];
}
