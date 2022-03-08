import { test } from "uvu";
import { equal, throws } from "uvu/assert";
import { parseDate } from "../../../src/scripts/utils/data-assets/parseDate.mjs";
import { parseEventTimes } from "../../../src/scripts/utils/data-assets/parsers/events/parseEventTimes.mjs";

test("can parse with date prop", () => {
  equal(
    parseEventTimes([
      { date: "2022-02-07 18:32 PST", title: "test date" },
      { date: "2022-02-07 18:00 - 02-08 18:00 PST", title: "test duration" }
    ]),
    [
      {
        start: parseDate("2022-02-07 18:32 PST", { flat: true }),
        title: "test date"
      },
      {
        start: parseDate("2022-02-07 18:00 PST", { flat: true }),
        end: parseDate("2022-02-08 18:00 PST", { flat: true }),
        title: "test duration"
      }
    ]
  );
});

test("can parse with times prop", () => {
  equal(
    parseEventTimes([
      {
        title: "rotation",
        times: [
          { title: "first", date: "2022-07-03 18:00 PDT" },
          { title: "second", date: "2022-07-04 14:00 PDT" },
          { title: "last", date: "2022-07-05 14:00 PDT" }
        ]
      }
    ])[0],
    {
      title: "rotation",
      times: [
        {
          title: "first",
          date: parseDate("2022-07-03 18:00 PDT", { flat: true })
        },
        {
          title: "second",
          date: parseDate("2022-07-04 14:00 PDT", { flat: true })
        },
        {
          title: "last",
          date: parseDate("2022-07-05 14:00 PDT", { flat: true })
        }
      ]
    }
  );
});

test("rejects with missing prop", () => {
  throws(() => {
    parseEventTimes([{ title: "no date or times prop" }]);
  });
});

test("rejects duration in times prop", () => {
  throws(() => {
    parseEventTimes([
      {
        title: "test",
        times: [
          { title: "die here", date: "2022-03-02 18:00 - 03-02 19:00 PST" }
        ]
      }
    ]);
  });
});

test("rejects non-array", () => {
  throws(() => {
    parseEventTimes({ hello: "world" });
  });
  throws(() => {
    parseEventTimes("hello, world!");
  });
});

test("hideWhenDone prop", () => {
  equal(
    parseEventTimes([
      { date: "2022-02-07 18:32 PST", title: "test date", hideWhenDone: true },
      {
        date: "2022-02-07 18:00 - 02-08 18:00 PST",
        title: "test duration",
        hideWhenDone: true
      }
    ]),
    [
      {
        start: parseDate("2022-02-07 18:32 PST", { flat: true }),
        hide: parseDate("2022-02-07 18:32 PST", { flat: true }),
        title: "test date"
      },
      {
        start: parseDate("2022-02-07 18:00 PST", { flat: true }),
        end: parseDate("2022-02-08 18:00 PST", { flat: true }),
        hide: parseDate("2022-02-08 18:00 PST", { flat: true }),
        title: "test duration"
      }
    ],
    "hideWhenDone with date prop"
  );

  equal(
    parseEventTimes([
      {
        title: "rotation",
        hideWhenDone: true,
        times: [
          { title: "first", date: "2022-07-03 18:00 PDT" },
          { title: "second", date: "2022-07-04 14:00 PDT" },
          { title: "last", date: "2022-07-05 14:00 PDT" }
        ]
      }
    ])[0],
    {
      title: "rotation",
      times: [
        {
          title: "first",
          date: parseDate("2022-07-03 18:00 PDT", { flat: true })
        },
        {
          title: "second",
          date: parseDate("2022-07-04 14:00 PDT", { flat: true })
        },
        {
          title: "last",
          date: parseDate("2022-07-05 14:00 PDT", { flat: true })
        }
      ],
      hide: parseDate("2022-07-05 14:00 PDT", { flat: true })
    },
    "hideWhenDone with times prop"
  );
});

test.run();
