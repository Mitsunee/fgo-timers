import { test } from "uvu";
import * as assert from "uvu/assert";
import { readFileYaml } from "@foxkit/node-util/fs-yaml";
import { parseDate } from "../../../src/scripts/utils/data-assets/parseDate.mjs";
import { parseEventTimes } from "../../../src/scripts/utils/data-assets/parsers/events/parseEventTimes.mjs";
import { parseEventFile } from "../../../src/scripts/utils/data-assets/parsers/events/parseEventFile.mjs";

test("parsing file", async () => {
  let tmp;
  const [raw, out] = await Promise.all([
    readFileYaml("tests/__mockups__/test-event.yml"),
    parseEventFile("tests/__mockups__/test-event.yml")
  ]);

  // copied string props
  tmp = ["title", "shortTitle", "banner", "url", "description"];
  for (const key of tmp) {
    assert.is(out[key], raw[key]);
  }

  // date props
  tmp = parseDate(raw.date);
  assert.is(out.start, tmp[0]);
  assert.is(out.end, tmp[1]);

  // times prop
  assert.equal(out.times, parseEventTimes(raw.times));

  // hideWhenDone
  assert.is(
    out.hide,
    Math.max(
      ...[
        out.end,
        ...out.times.flatMap(({ start, end, times }) => {
          if (end) return [end];
          if (start) return [start];
          if (times) return times.map(({ date }) => date);
        })
      ]
    )
  );
});

test("throw on missing prop", async () => {
  try {
    await parseEventFile("tests/__mockups__/test-event-no-title.yml");
  } catch {
    return;
  }
  assert.unreachable("Failed to throw");
});

test.run();
