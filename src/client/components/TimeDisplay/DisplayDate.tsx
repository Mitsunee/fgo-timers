import spacetime from "spacetime";
import { useStore } from "@nanostores/react";
import { settingsStore } from "src/client/stores/settingsStore";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { Global } from "src/types/enum";

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
  /**
   * Time in seconds
   */
  time: number;
  format?: Formats;
  /**
   * "never" will always render time as user's timezone (doesn't prerender)
   * "always" will never use user's timezone (always serverTz, prerenders)
   * "ssr" uses serverTz to prerender and user's timezone after (default, prerenders)
   */
  serverTz?: "never" | "always" | "ssr";
}

export function DisplayDate({
  time,
  format: formatAlias = "short",
  serverTz = "ssr"
}: DisplayDateProps) {
  const settings = useStore(settingsStore);
  const isClient = useIsClient();
  const isRendered = serverTz != "never" || isClient;
  const format = getFormat(formatAlias, settings.alternativeClockFormat);
  let tz: undefined | string;

  switch (serverTz) {
    case "always":
      tz = Global.SERVER_TZ;
      break;
    case "ssr":
      if (!isClient || settings.showServerTimes) tz = Global.SERVER_TZ;
      break;
  }

  return isRendered ? (
    <time>{spacetime(time * 1000, tz).format(format)}</time>
  ) : null;
}
