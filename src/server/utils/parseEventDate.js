/* parseEventDate
 * This module parses Dates and Durations found in data files
 */

import spacetime from "spacetime";

import { createServerError } from "./createServerError";

const tzOffset = new Map([
  ["PST", "-08:00"],
  ["PDT", "-07:00"]
]);

function convertDate({ date, time, timezone }) {
  const s = spacetime(`${date}T${time}:00${tzOffset.get(timezone)}`);

  return Math.trunc(s.epoch / 1000);
}

export function parseEventDate(
  date,
  { allowDuration = true, parent = null, flat = false }
) {
  if (date.includes(" - ")) {
    // date is a duration
    if (!allowDuration) {
      throw createServerError(
        `Expected date ${date} to Date but received Duration`,
        parent
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
    throw createServerError(`Couldn't parse Date '${date}'`, parent);
  }
  const result = convertDate(match.groups);

  return flat ? result : [result];
}
