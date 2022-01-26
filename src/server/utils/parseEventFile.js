/* parseEventFile
 * This module parses event files given a filePath
 */

import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { log } from "@foxkit/node-util/log";

import { parseEventDate } from "./parseEventDate";
import { parseEventTimes } from "./parseEventTimes";

const requiredProps = new Map([
  ["title", "string"],
  ["shortTitle", "string"],
  ["date", "string"]
]);
const optionalProps = new Map([
  ["url", "string"],
  ["displayOrder", "number"],
  ["description", "object"],
  ["times", "object"]
]);

export async function parseEventFile(filePath) {
  const rawData = await readFileYaml(filePath);
  if (!rawData) throw new Error(`Could not read file '${filePath}'`);
  const parsedData = new Object();

  // required properties
  for (const [prop, expectedType] of requiredProps) {
    if (typeof rawData[prop] !== expectedType) {
      throw new TypeError(
        `Expected required property ${prop} to be type ${expectedType} in '${filePath}'`
      );
    }
    if (prop !== "date") parsedData[prop] = rawData[prop]; // date is handled below
  }

  // date property
  const [start, end] = parseEventDate(rawData.date, { parent: filePath });
  parsedData.start = start;
  if (end) parsedData.end = end;

  // optional properties
  for (const [prop, expectedType] of optionalProps) {
    const isType = typeof rawData[prop];
    if (isType !== expectedType) {
      if (!(rawData[prop] == null || isType === "undefined")) {
        log.warn(
          `Expected optional property ${prop} to be type ${expectedType} in '${filePath}'`
        );
      }
      // while not having a url is correctly handled in the client it is usually
      // a special case if none is included. Thus a warning is thrown here
      if (prop === "url") log.warn(`No url in Event '${filePath}'`);
      continue;
    }
    if (prop !== "times") parsedData[prop] = rawData[prop]; // times is handled below
  }

  // times property
  if (rawData.times) {
    parsedData.times = parseEventTimes(rawData.times, { parent: filePath });
  }

  // hideWhenDone property
  if (rawData.hideWhenDone !== undefined) {
    if (rawData.hideWhenDone !== "auto" && rawData.hideWhenDone !== true) {
      throw new TypeError(
        `Expected optional property hideWhenDone to be either true or "auto" in '${filePath}'`
      );
    }

    if (rawData.hideWhenDone === "auto") {
      const possibleHideTimes = new Set();
      possibleHideTimes.add(end || start);

      if (parsedData.times) {
        for (const time of parsedData.times) {
          if (time.end) {
            possibleHideTimes.add(time.end);
            continue;
          }
          if (time.times) {
            possibleHideTimes.add(time.times[time.times.length - 1].date);
          }
        }
      }

      parsedData.hide = Math.max(...possibleHideTimes);
    } else {
      parsedData.hide = end || start;
    }
  }

  return parsedData;
}
