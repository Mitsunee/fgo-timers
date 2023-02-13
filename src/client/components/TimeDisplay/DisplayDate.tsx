import spacetime from "spacetime";
import { useStore } from "@nanostores/react";
import { settingsStore } from "src/client/stores/settingsStore";
import { Global } from "src/types/enum";
import { NoSSR } from "src/client/components/NoSSR";

type Formats = "full" | "withSec" | "short" | "time" | "date";

const DateFormats: Record<Formats, string | [string, string]> = {
  full: ["nice-full", "nice-full-24"],
  short: ["nice-short", "nice-short-24"],
  withSec: [
    "{month-short} {date-ordinal}, {hour-pad}:{minute-pad}:{second-pad}{ampm}",
    "{month-short} {date-ordinal}, {hour-24-pad}:{minute-pad}:{second-pad}"
  ],
  time: ["{hour-pad}:{minute-pad}{ampm}", "{hour-24-pad}:{minute-pad}"],
  date: "{date-ordinal} {month} {year}"
};

function getFormat(alias: Formats, altClockFormat: boolean) {
  const format = DateFormats[alias];
  if (Array.isArray(format)) return format[altClockFormat ? 0 : 1];
  return format;
}

interface DisplayDateProps {
  time: number;
  format?: Formats;
  serverTz?: "never" | "always";
}

export function DisplayDate({
  time,
  format: formatAlias = "short",
  serverTz
}: DisplayDateProps) {
  const settings = useStore(settingsStore);
  const format = getFormat(formatAlias, settings.alternativeClockFormat);
  const tz: undefined | string =
    serverTz == "always" || (serverTz != "never" && settings.showServerTimes)
      ? Global.SERVER_TZ
      : undefined;

  return (
    <NoSSR>
      <time>{spacetime(time, tz).format(format)}</time>
    </NoSSR>
  );
}
