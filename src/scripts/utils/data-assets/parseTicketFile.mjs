import { readFileYaml } from "@foxkit/node-util/fs-yaml";

import { getNiceItem } from "../../../atlas-api/cache.ts";
import { parseTicketMonth } from "./parseTicketMonth.mjs";

let niceItem = null;
async function prepareNiceItem() {
  if (niceItem == null) {
    niceItem = await getNiceItem("JP");
  }
}

let niceItemNa = null;
async function prepareNiceItemNa() {
  if (niceItemNa == null) {
    niceItemNa = await getNiceItem("NA");
  }
}

let itemIdMap = null;
async function prepareIdMap() {
  if (itemIdMap == null) {
    itemIdMap = await readFileYaml("assets/data/itemIdMap.yml");
    if (!itemIdMap) {
      throw new Error("Could not read assets/data/itemIdMap.yml");
    }
  }
}

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
  const [rawData] = await Promise.all([
    readFileYaml(filePath),
    prepareIdMap(),
    prepareNiceItem(),
    prepareNiceItemNa()
  ]);
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
    parsedData[month] = parseTicketMonth(rawData[month], {
      itemIdMap,
      niceItem,
      niceItemNa
    });
  }

  if (Object.keys(parsedData).length < 1) {
    throw new Error("File did not contain any valid data");
  }

  return parsedData;
}
