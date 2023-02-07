export function normalizeDate(
  date: number | [number, number]
): [number, number] {
  const [start, end = 0] = Array.isArray(date) ? date : [date];
  return [start, end];
}
