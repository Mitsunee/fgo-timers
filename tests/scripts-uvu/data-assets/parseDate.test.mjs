import { test } from "uvu";
import { is, equal, throws } from "uvu/assert";
import { parseDate } from "../../../src/scripts/utils/data-assets/parseDate.mjs";

/***
2022-03-01 19:00 PST
1646190000

2022-03-10 20:00 PST
1646971200

2022-03-13 21:00 PDT
1647230400

2022-03-15 21:00 PDT
1647403200
***/

test("can parse Dates and Durations", () => {
  equal(parseDate("2022-03-15 21:00 PDT"), [1647403200], "parses Dates");
  equal(
    parseDate("2022-03-01 19:00 PST - 2022-03-13 21:00 PDT"),
    [1646190000, 1647230400],
    "parses Durations"
  );
});

test("rejects durations when allowDuration = false", () => {
  throws(() =>
    parseDate("2022-03-01 19:00 PST - 2022-03-13 21:00 PDT", {
      allowDuration: false
    })
  );
});

test("can return number for Date with flat = true", () => {
  is(
    parseDate("2022-03-15 21:00 PDT", { flat: true }),
    1647403200,
    "parses Dates as number"
  );
  equal(
    parseDate("2022-03-01 19:00 PST - 2022-03-13 21:00 PDT", { flat: true }),
    [1646190000, 1647230400],
    "still parses Durations as Array"
  );
});

test("can parse Durations with only start year", () => {
  equal(
    parseDate("2022-03-10 20:00 PST - 03-13 21:00 PDT"),
    [1646971200, 1647230400]
  );
});

test("can parse Durations with only end timezone", () => {
  equal(
    parseDate("2022-03-13 21:00 - 2022-03-15 21:00 PDT"),
    [1647230400, 1647403200]
  );
});

test("rejects bad values", () => {
  throws(() => parseDate("random string"));
  // Durations
  throws(() => parseDate("2022-03-13 21:00 - 2022-03-15 21:00")); // no TZ
  throws(() => parseDate("03-13 21:00 - 2022-03-15 21:00 PDT")); // no Year
  throws(() => parseDate("2022-03-13 - 2022-03-15 21:00 PDT")); // missing start hours
  throws(() => parseDate("2022-03-13 21:00 - 2022-03-15 PDT")); // missing end hours
  // Dates
  throws(() => parseDate("2022-03-15 21:00")); // no TZ
  throws(() => parseDate("03-15 21:00 PDT")); // no Year
  throws(() => parseDate("2022-03-13 PDT")); // missing hours
});

test.run();
