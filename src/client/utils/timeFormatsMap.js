// TODO: phase out this and useFormatted* hooks with new TimeDisplay components

/**
 * !DEPRECATED!
 */
export const timeFormatsMap = new Map([
  ["clock-12", "{hour-pad}:{minute-pad}{ampm}"],
  ["clock-24", "{hour-24-pad}:{minute-pad}"],
  ["short-12", "nice-short"],
  ["short-24", "nice-short-24"],
  [
    "short-sec-12",
    "{month-short} {date-ordinal}, {hour-pad}:{minute-pad}:{second-pad}{ampm}"
  ],
  [
    "short-sec-24",
    "{month-short} {date-ordinal}, {hour-24-pad}:{minute-pad}:{second-pad}"
  ],
  ["full-12", "nice-full"],
  ["full-24", "nice-full-24"],
  ["date", "{date-ordinal} {month} {year}"],
  ["day-short", "day-short"]
]);
