import { test } from "uvu";
import { equal } from "uvu/assert";
import { sortEvents } from "../../../src/scripts/utils/data-assets/sortEvents.mjs";

test("sorts events by start time", () => {
  equal(
    sortEvents([
      { ref: 1, start: 5 },
      { ref: 2, start: 2 },
      { ref: 3, start: 10 },
      { ref: 4, start: 8 },
      { ref: 5, start: 15 }
    ]),
    [
      { ref: 5, start: 15 },
      { ref: 3, start: 10 },
      { ref: 4, start: 8 },
      { ref: 1, start: 5 },
      { ref: 2, start: 2 }
    ]
  );
});

test("sorts by order if start time equal", () => {
  equal(
    sortEvents([
      { ref: 1, start: 3, order: 2 },
      { ref: 2, start: 3, order: 1 },
      { ref: 3, start: 1 }
    ]),
    [
      { ref: 2, start: 3, order: 1 },
      { ref: 1, start: 3, order: 2 },
      { ref: 3, start: 1 }
    ]
  );
});

test.run();
