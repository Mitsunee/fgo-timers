import { normalizeDate } from "src/time/normalizeDate";

interface FormatTSProps {
  time: number | [number, number];
  slug: string;
  title: string;
}

export function formatTS({ time, title, slug }: FormatTSProps): string {
  const [start, end] = normalizeDate(time);
  const text = `__${title}__\nStarts: <t:${start}:F> (<t:${start}:R>)${
    end > 0 ? `\nEnds: <t:${end}:F> (<t:${end}:R>)` : ""
  }\nMore info: <https://fgo.mitsunee.com/events/${slug}>`;

  return text;
}
