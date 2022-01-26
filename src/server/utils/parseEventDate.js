/* parseEventDate
 * This module parses Dates and Durations found in event files
 */

import spacetime from "spacetime";

const tzOffset = new Map([
  ["PST", "-08:00"],
  ["PDT", "-07:00"]
]);

function convertDate({ date, time, timezone }) {
  const s = spacetime(`${date}T${time}:00${tzOffset.get(timezone)}`);

  return Math.trunc(s.epoch / 1000);
}

function createDateError(message, parent = false) {
  return new Error(`${message}${parent ? ` in '${parent}'` : ""}`);
}

export function parseEventDate(
  date,
  { allowDuration = true, parent = null, flat = false }
) {
  if (date.contains("-")) {
    // date is a duration
    if (!allowDuration) {
      throw createDateError(
        `Expected date ${date} to Date but received Duration`,
        parent
      );
    }

    let [start, end] = date.split("-").map(str => str.trim());
    if (!start.endsWith("PST") && !start.endsWith("PDT")) {
      // start Date has no own timezone
      start = `${start} ${end.slice(-3)}`;
    }

    start = parseEventDate(start, {
      allowDuration: false,
      parent: parent || date,
      flat: true
    });
    end = parseEventDate(end, {
      allowDuration: false,
      parent: parent || date,
      flat: true
    });

    return [start, end];
  }

  const match = date.match(
    /(?<date>\d{4}-\d{2}-\d{2}) (?<time>\d{2}:\d{2}) (?<timezone>P[DS]T)/i
  );
  if (!match) {
    throw createDateError(
      `Couldn't parse Date '${date}'${parent ? `in ${parent}` : ""}`,
      parent
    );
  }
  const result = convertDate(match);

  return flat ? result : [result];
}
