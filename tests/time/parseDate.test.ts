import { parseDuration, parseDate } from "src/time/parseDate";
/***
example values for testing:
2022-03-01 19:00 PST
1646190000

2022-03-10 20:00 PST
1646971200

2022-03-13 21:00 PDT
1647230400

2022-03-15 21:00 PDT
1647403200
***/

describe("parseDuration", () => {
  it("can parse Dates and Durations", () => {
    expect(parseDuration("2022-03-15 21:00 PDT")).toBe(1647403200);
    expect(
      parseDuration("2022-03-01 19:00 PST - 2022-03-13 21:00 PDT")
    ).toEqual([1646190000, 1647230400]);
  });

  it("rejects durations when isDuration = false", () => {
    expect(() =>
      parseDuration("2022-03-01 19:00 PST - 2022-03-13 21:00 PDT", false)
    ).toThrow();
  });

  it("rejects dates with isDuration = true", () => {
    expect(() => parseDuration("2022-03-15 21:00 PDT", true)).toThrow();
  });

  it("can parse Durations with only start year", () => {
    expect(parseDuration("2022-03-10 20:00 PST - 03-13 21:00 PDT")).toEqual([
      1646971200, 1647230400
    ]);
  });

  it("can parse Durations with only end timezone", () => {
    expect(parseDuration("2022-03-13 21:00 - 2022-03-15 21:00 PDT")).toEqual([
      1647230400, 1647403200
    ]);
  });

  it("rejects bad values", () => {
    expect(() => parseDuration("random string")).toThrow();
    // Durations
    expect(() =>
      parseDuration("2022-03-13 21:00 - 2022-03-15 21:00")
    ).toThrow(); // no TZ
    expect(() => parseDuration("03-13 21:00 - 2022-03-15 21:00 PDT")).toThrow(); // no Year
    expect(() => parseDuration("2022-03-13 - 2022-03-15 21:00 PDT")).toThrow(); // missing start hours
    expect(() => parseDuration("2022-03-13 21:00 - 2022-03-15 PDT")).toThrow(); // missing end hours
    // Dates
    expect(() => parseDuration("2022-03-15 21:00")).toThrow(); // no TZ
    expect(() => parseDuration("03-15 21:00 PDT")).toThrow(); // no Year
    expect(() => parseDuration("2022-03-13 PDT")).toThrow(); // missing hours
  });
});

describe("parseDate", () => {
  it("can parse Dates", () => {
    expect(parseDate("2022-03-15 21:00 PDT")).toBe(1647403200);
  });

  it("rejects bad values", () => {
    expect(() => parseDate("random string")).toThrow();
    expect(() => parseDate("2022-03-15 21:00")).toThrow(); // no TZ
    expect(() => parseDate("03-15 21:00 PDT")).toThrow(); // no Year
    expect(() => parseDate("2022-03-13 PDT")).toThrow(); // missing hours
  });
});
