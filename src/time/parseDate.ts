import spacetime from "spacetime";
import { msToSeconds } from "./msToSeconds";

const tzOffset = {
  PST: "-08:00",
  PDT: "-07:00"
} as const;

interface TimestampProps {
  date: `${number}-${number}-${number}`;
  time: `${number}:${number}`;
  timezone: keyof typeof tzOffset;
}

function toTimestamp({ date, time, timezone }: TimestampProps) {
  const s = spacetime(`${date}T${time}:00${tzOffset[timezone]}`);
  return msToSeconds(s.epoch);
}

/**
 * Parses date in string format to timestamp as number in seconds
 * @param date Date as string
 * @throws if string could not be parsed
 * @returns
 */
export function parseDate(date: string, fullStr?: string): number {
  const match = date.match(
    /^(?<date>\d{4}-\d{2}-\d{2}) (?<time>\d{2}:\d{2}) (?<timezone>P[DS]T)$/i
  ) as null | { groups: TimestampProps };

  if (!match) {
    throw new Error(`Couldn't parse Date '${fullStr || date}'`);
  }

  return toTimestamp(match.groups);
}

/**
 * Parses Date/Duration as string to timestamp as number in seconds
 * @param date Date/Duration as string
 * @param isDuration null or boolean to determine whether to expect Duration (`true`), expect Date (`false`) or allow both (`null`) (default: `null`)
 * @throws if string could not be parsed
 * @throws if isDuration is set to `true` and Date as string was given
 * @throws if isDuration is set to `false` and Duration as string was given
 * @returns timestamp as number in seconds or Tuple of start and end time as numbers in seconds
 */
// prettier-ignore
export function parseDuration(date: string, isDuration?: null): number | [number,number];
export function parseDuration(date: string, isDuration: true): [number, number];
export function parseDuration(date: string, isDuration: false): number;
export function parseDuration(
  date: string,
  isDuration: boolean | null = null
): number | [number, number] {
  if (date.includes(" - ")) {
    // date is a duration
    if (isDuration === false) {
      throw new TypeError(
        `Expected date '${date}' to be Date but received Duration`
      );
    }

    let [start, end] = date.split(" - ").map(str => str.trim());
    if (!start.endsWith("PST") && !start.endsWith("PDT")) {
      // start Date has no own timezone
      start = `${start} ${end.slice(-3)}`;
    }
    if (!/^\d{4}/.test(end)) {
      // end Date has no own year
      end = `${start.slice(0, 4)}-${end}`;
    }

    const startTs = parseDate(start, date);
    const endTs = parseDate(end, date);

    return [startTs, endTs];
  }

  if (isDuration === true) {
    throw new TypeError(
      `Expected date '${date}' to be Duration but received Date`
    );
  }

  return parseDate(date);
}
