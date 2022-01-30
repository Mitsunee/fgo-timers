/* parseEventTimes
 * This module parses the `times` property in event files for `parseEventFile`
 */

import { parseEventDate } from "./parseEventDate";

export function parseEventTimes(times, { parent = false }) {
  const parsedTimes = new Array();

  for (const time of times) {
    const parsedTime = new Object();
    if (typeof time.title !== "string") {
      throw new TypeError(
        `Additional Event Times must have a title property of type string${
          parent ? ` (in: '${parent}')` : ""
        }`
      );
    }

    // pass title property
    parsedTime.title = time.title;

    // handle single-date times
    if (time.date) {
      // date property
      if (typeof time.date !== "string") {
        throw new TypeError(
          `Expected date property of additional Event time to be of type string${
            parent ? ` (in: '${parent}')` : ""
          }`
        );
      }
      const [start, end] = parseEventDate(time.date, { parent });
      parsedTime.start = start;
      if (end) parsedTime.end = end;

      // hideWhenDone property
      if (time.hideWhenDone) parsedTime.hide = end || start;

      continue;
    }

    // handle multi-date times
    if (time.times) {
      // times property
      parsedTime.times = new Array();
      for (const { date, title } of time.times) {
        if (typeof date !== "string") {
          throw new TypeError(
            `Expected each sub-time of additional event time to have a date property of type string${
              parent ? ` (in: '${parent}')` : ""
            }`
          );
        }
        if (typeof title !== "string") {
          throw new TypeError(
            `Expected each sub-time of additional event time to have a title property of type string${
              parent ? ` (in: '${parent}')` : ""
            }`
          );
        }
        const subTime = new Object();
        subTime.title = title;
        subTime.date = parseEventDate(date, {
          parent,
          flat: true,
          allowDuration: false
        });
        parsedTime.times.push(subTime);
      }

      // hideWhenDone property
      if (time.hideWhenDone) {
        parsedTime.hide = parsedTime.times[parsedTime.times.length - 1].date;
      }

      continue;
    }

    throw new TypeError(
      `Expected additional event time to either have date or times property${
        parent ? ` (in: '${parent}')` : ""
      }`
    );
  }

  return parsedTimes;
}
