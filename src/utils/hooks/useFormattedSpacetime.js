import { useState, useEffect } from "react";
import { useStore } from "nanostores/react";

import { settingsStore } from "@stores/settingsStore";
import { timeFormatsMap } from "@utils/timeFormatsMap";

export function useFormattedSpacetime(spacetime, formatName) {
  const [output, setOutput] = useState("");
  const { alternativeClockFormat, showServerTimes } = useStore(settingsStore);

  useEffect(() => {
    const format =
      timeFormatsMap.get(formatName) ||
      timeFormatsMap.get(`${formatName}-${alternativeClockFormat ? 12 : 24}`);
    setOutput(
      spacetime
        ? showServerTimes
          ? spacetime.goto("America/Los_Angeles").format(format)
          : spacetime.format(format)
        : ""
    );
  }, [spacetime, formatName, alternativeClockFormat, showServerTimes]);

  return output;
}
