import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { getFileName } from "@foxkit/node-util/path";

import { warn } from "../log.mjs";
import { parseDate } from "./parseDate.mjs";
import { parseEventTimes } from "./parseEventTimes.mjs";

const requiredProps = new Map([
  ["title", "string"],
  ["shortTitle", "string"],
  ["date", "string"],
  ["banner", "string"]
]);
const optionalProps = new Map([
  ["url", "string"],
  ["displayOrder", "number"],
  ["description", "string"],
  ["times", "object"]
]);

export async function parseEventFile(filePath) {
  const rawData = await readFileYaml(filePath);
  if (!rawData) throw new Error(`Could not read file`);
  const parsedData = new Object();

  // slug property
  parsedData.slug = getFileName(filePath, false);

  // required properties
  for (const [prop, expectedType] of requiredProps) {
    if (typeof rawData[prop] !== expectedType) {
      throw new TypeError(
        `Expected required property ${prop} to be type ${expectedType}`
      );
    }

    if (prop === "date") {
      const [start, end] = parseDate(rawData.date);
      parsedData.start = start;
      if (end) parsedData.end = end;
      continue;
    }

    parsedData[prop] = rawData[prop];
  }

  // optional properties
  for (const [prop, expectedType] of optionalProps) {
    const isType = typeof rawData[prop];
    if (isType !== expectedType) {
      if (!(rawData[prop] == null || isType === "undefined")) {
        throw new TypeError(
          `Expected optional property ${prop} to be type ${expectedType}`
        );
      }
      // while not having a url is correctly handled in the client it is usually
      // a special case if none is included. Thus a warning is thrown here
      if (prop === "url") warn(`No url in Event`, filePath);
      continue;
    }

    switch (prop) {
      case "times":
        parsedData.times = parseEventTimes(rawData.times);
        break;
      case "displayOrder":
        parsedData.order = rawData.displayOrder;
        break;
      default:
        parsedData[prop] = rawData[prop];
    }
  }

  // hideWhenDone property
  if (rawData.hideWhenDone !== undefined) {
    if (rawData.hideWhenDone !== "auto" && rawData.hideWhenDone !== true) {
      throw new TypeError(
        `Expected optional property hideWhenDone to be either true or "auto"`
      );
    }

    if (rawData.hideWhenDone === "auto") {
      const possibleHideTimes = new Set();
      possibleHideTimes.add(parsedData.end || parsedData.start);

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
      parsedData.hide = parsedData.end || parsedData.start;
    }
  }

  return parsedData;
}
