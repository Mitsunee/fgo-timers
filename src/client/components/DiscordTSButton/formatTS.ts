export function formatTS(time: number | number[]): string {
  const [start, end = 0] = Array.isArray(time) ? time : [time];
  const text = `Starts: <t:${start}:F> (<t:${start}:R>)${
    end > 0 ? `\nEnds: <t:${end}:F> (<t:${end}:R>)` : ""
  }`;

  return text;
}
