import { test } from "uvu";
import * as assert from "uvu/assert";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { shortenStaticUrl } from "../../../src/scripts/utils/data-assets/shortenStaticUrl.mjs";
import { parseShopInventory } from "../../../src/scripts/utils/data-assets/parsers/shopFile/parseShopInventory.mjs";
import { parseShopFile } from "../../../src/scripts/utils/data-assets/parsers/shopFile/parseShopFile.mjs";

test("parsing file", async () => {
  const [raw, out] = await Promise.all([
    readFileYaml("tests/__mockups__/test-prismShop.yml"),
    parseShopFile("tests/__mockups__/test-prismShop.yml")
  ]);

  // copied string props
  const tmp = ["title", "color"];
  for (const key of tmp) {
    assert.is(out[key], raw[key]);
  }

  // icon prop
  assert.is(out.icon, shortenStaticUrl(raw.icon));

  // inventory prop
  assert.equal(out.inventory, parseShopInventory(raw.inventory));
});

test("parsing file with limited inventory", async () => {
  const [raw, out] = await Promise.all([
    readFileYaml("tests/__mockups__/test-prismShop-with-limited.yml"),
    parseShopFile("tests/__mockups__/test-prismShop-with-limited.yml")
  ]);

  // copied string props
  const tmp = ["title", "color"];
  for (const key of tmp) {
    assert.is(out[key], raw[key]);
  }

  // icon prop
  assert.is(out.icon, shortenStaticUrl(raw.icon));

  // inventory props
  assert.equal(out.inventory, parseShopInventory(raw.inventory));
  assert.equal(out.limited, parseShopInventory(raw.limitedInventory, true));
});

test("throw on missing prop", async () => {
  try {
    await parseShopFile("tests/__mockups__/test-prismShop-no-title.yml");
  } catch {
    return;
  }
  assert.unreachable("Failed to throw");
});

test.run();
