import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";

import { settingsStore } from "@stores/settingsStore";
import { timeFormatsMap } from "@utils/timeFormatsMap";

// TODO: phase out in favour of new typed Component
export function useFormattedSpacetime(spacetime, formatName, ignoreSettings) {
  const [output, setOutput] = useState("");
  const { alternativeClockFormat, showServerTimes } = useStore(settingsStore);

  useEffect(() => {
    const format =
      timeFormatsMap.get(formatName) ||
      timeFormatsMap.get(`${formatName}-${alternativeClockFormat ? 12 : 24}`);
    setOutput(
      spacetime
        ? !ignoreSettings && showServerTimes
          ? spacetime.goto("America/Los_Angeles").format(format)
          : spacetime.format(format)
        : ""
    );
  }, [
    spacetime,
    formatName,
    alternativeClockFormat,
    showServerTimes,
    ignoreSettings
  ]);

  return output;
}
