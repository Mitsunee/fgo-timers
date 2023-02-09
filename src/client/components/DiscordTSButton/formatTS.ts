import { normalizeDate } from "src/time/normalizeDate";

export function formatTS(time: number | [number, number]): string {
  const [start, end] = normalizeDate(time);
  const text = `Starts: <t:${start}:F> (<t:${start}:R>)${
    end > 0 ? `\nEnds: <t:${end}:F> (<t:${end}:R>)` : ""
  }`;

  return text;
}
