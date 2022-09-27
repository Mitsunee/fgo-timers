import { test } from "uvu";
import * as assert from "uvu/assert";
import { getComponentName } from "../../../src/scripts/utils/svg/getComponentName.mjs";

test("generates properly camelcased names", () => {
  assert.is(getComponentName("lorem-ipsum-symbol"), "IconLoremIpsumSymbol");
  assert.is(getComponentName("lorem-ipsum-69"), "IconLoremIpsum");
  assert.is(
    getComponentName("lorem_ipsum_underscored"),
    "IconLoremIpsumUnderscored"
  );
  assert.is(getComponentName("alreadyCamelCased"), "IconAlreadyCamelCased");
});

test.run();
