import { readFileYaml } from "@foxkit/node-util/fs-yaml";

import { parseTicketMonth } from "./parseTicketMonth.mjs";

const months = new Set([
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
]);

export async function parseTicketFile(filePath) {
  const rawData = await readFileYaml(filePath);
  if (!rawData) throw new Error(`Couldn't read Prism Shop file`);
  const parsedData = new Object();

  for (const month of months) {
    if (typeof rawData[month] === "undefined") continue;
    if (!(rawData[month] instanceof Array)) {
      throw new TypeError(`Expected property ${month} of type Array`);
    }
    if (!rawData[month].every(item => typeof item === "string")) {
      throw new TypeError(`Expected property ${month} to contain strings`);
    }
    if (rawData[month].length !== 3) {
      throw new TypeError(`Expected property ${month} to contain 3 elements`);
    }
    parsedData[month] = await parseTicketMonth(rawData[month]);
  }

  if (Object.keys(parsedData).length < 1) {
    throw new Error("File did not contain any valid data");
  }

  return parsedData;
}
