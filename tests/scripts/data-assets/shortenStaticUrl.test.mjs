import { test } from "uvu";
import { is, ok } from "uvu/assert";
import { shortenStaticUrl } from "../../../src/scripts/utils/data-assets/shortenStaticUrl.mjs";

test("shortens static url", () => {
  is(shortenStaticUrl("https://static.atlasacademy.io/test-url"), "test-url");
});

test("leaves invalid url unchanged", () => {
  let warned = false;
  const consoleWarn = console.warn;
  global.console.warn = () => {
    warned = true;
  };
  is(shortenStaticUrl("lorem ipsum dolor"), "lorem ipsum dolor");
  global.console.warn = consoleWarn;
  ok(warned);
});

test.run();
