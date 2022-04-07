import { test } from "uvu";
import { equal, unreachable } from "uvu/assert";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { prepareAtlasCache } from "../../../src/scripts/utils/atlasacademy/prepareCache.mjs";
import { readFromCache } from "../../../src/scripts/utils/atlasacademy/cache.mjs";
import { parseTicketMonth } from "../../../src/scripts/utils/data-assets/parseTicketMonth.mjs";
import { parseTicketFile } from "../../../src/scripts/utils/data-assets/parseTicketFile.mjs";

let niceItem;
let niceItemNa;
let itemIdMap;

test.before(async () => {
  await prepareAtlasCache();
  niceItem = await readFromCache("JP", "nice_item_lang_en.json");
  niceItemNa = await readFromCache("NA", "nice_item.json");
  itemIdMap = await readFileYaml("assets/data/itemIdMap.yml");
});

test("can parse valid file", async () => {
  const [raw, out] = await Promise.all([
    readFileYaml("tests/__mockups__/test-ticketYear.yml"),
    parseTicketFile("tests/__mockups__/test-ticketYear.yml")
  ]);

  for (const month in out) {
    equal(
      out[month],
      parseTicketMonth(raw[month], { niceItem, niceItemNa, itemIdMap })
    );
  }
});

test("throws if too many items", async () => {
  try {
    await parseTicketFile("tests/__mockups__/test-ticketYear-too-many.yml");
  } catch {
    return;
  }
  unreachable("Failed to throw");
});

test("throws if no data", async () => {
  try {
    await parseTicketFile("tests/__mockups__/test-ticketYear-no-data.yml");
  } catch {
    return;
  }
  unreachable("Failed to throw");
});

test.run();
