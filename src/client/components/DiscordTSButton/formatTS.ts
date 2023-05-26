import { normalizeDate } from "~/time/normalizeDate";

interface FormatTSProps {
  time: number | [number, number];
  slug: string;
  title: string;
}

export function formatTS(
  { time, title, slug }: FormatTSProps,
  newFormat?: boolean
): string {
  const [start, end] = normalizeDate(time);
  const link = newFormat
    ? `[More info on FGO Timers](<https://fgo.mitsunee.com/events/${slug}>)`
    : `More info: <https://fgo.mitsunee.com/events/${slug}>`;

  const text = `__${title}__\nStarts: <t:${start}:F> (<t:${start}:R>)${
    end > 0 ? `\nEnds: <t:${end}:F> (<t:${end}:R>)` : ""
  }\n${link}`;

  return text;
}
