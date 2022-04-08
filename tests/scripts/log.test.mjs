import { test } from "uvu";
import { is } from "uvu/assert";
import picocolors from "picocolors";
import { _format } from "../../src/scripts/utils/log.mjs";

test("handles no parent", () => {
  is(_format("testA", "Test Log"), "testA - Test Log", "no prefix color");
  is(
    _format("testB", "Test Log", false, "red"),
    `${picocolors.red("testB")} - Test Log`,
    "with prefix color"
  );
});

test("pads prefix shorter than 5", () => {
  is(_format("test ", "Test Log"), "test  - Test Log", "no prefix color");
  is(
    _format("test ", "Test Log", false, "red"),
    `${picocolors.red("test ")} - Test Log`,
    "with prefix color"
  );
});

test("handles with parent", () => {
  is(
    _format("test", "Test Log", "uvu"),
    `test  - Test Log${picocolors.gray(" in 'uvu'")}`,
    "no prefix color"
  );
  is(
    _format("test", "Test Log", "uvu", "red"),
    `${picocolors.red("test ")} - Test Log${picocolors.gray(" in 'uvu'")}`,
    "with prefix color"
  );
});

test.run();
