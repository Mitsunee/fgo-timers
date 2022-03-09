import { parseDate } from "./parseDate.mjs";

export function parseEventTimes(times) {
  const parsedTimes = new Array();

  for (const time of times) {
    const parsedTime = new Object();
    if (typeof time.title !== "string") {
      throw new TypeError(
        `Additional Event Times must have a title property of type string`
      );
    }

    // pass title property
    parsedTime.title = time.title;

    // handle single-date times
    if (time.date) {
      // date property
      if (typeof time.date !== "string") {
        throw new TypeError(
          `Expected date property of additional Event time to be of type string`
        );
      }
      const [start, end] = parseDate(time.date);
      parsedTime.start = start;
      if (end) parsedTime.end = end;

      // hideWhenDone property
      if (time.hideWhenDone) parsedTime.hide = end || start;

      parsedTimes.push(parsedTime);
      continue;
    }

    // handle multi-date times
    if (time.times) {
      // times property
      parsedTime.times = new Array();
      for (const { date, title } of time.times) {
        if (typeof date !== "string") {
          throw new TypeError(
            `Expected each sub-time of additional event time to have a date property of type string`
          );
        }
        if (typeof title !== "string") {
          throw new TypeError(
            `Expected each sub-time of additional event time to have a title property of type string`
          );
        }
        const subTime = new Object();
        subTime.title = title;
        subTime.date = parseDate(date, {
          flat: true,
          allowDuration: false
        });
        parsedTime.times.push(subTime);
      }

      // hideWhenDone property
      if (time.hideWhenDone) {
        parsedTime.hide = parsedTime.times[parsedTime.times.length - 1].date;
      }

      parsedTimes.push(parsedTime);
      continue;
    }

    throw new TypeError(
      `Expected additional event time to either have date or times property`
    );
  }

  return parsedTimes;
}
