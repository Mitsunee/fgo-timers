import { parseDate } from "./parseDate";

export function parseRotationTime(rotation) {
  const { title, date } = rotation;

  return {
    title,
    startsAt: parseDate(date)
  };
}
