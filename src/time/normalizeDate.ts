/**
 * Normalizes parsed Date/Duration property to Tuple (using 0 is default for end time)
 * @param date number or Duration Tuple
 * @returns Duration Tuple
 */
export function normalizeDate(
  date: number | [number, number]
): [number, number] {
  const [start, end = 0] = Array.isArray(date) ? date : [date];
  return [start, end];
}
