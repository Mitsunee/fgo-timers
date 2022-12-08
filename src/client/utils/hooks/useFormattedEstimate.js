import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import spacetime from "spacetime";

import { settingsStore } from "@stores/settingsStore";

function spacetimeBuilder(timestamp, serverTime) {
  return serverTime
    ? spacetime(timestamp, "America/Los_Angeles")
    : spacetime(timestamp);
}

// TODO: phase out in favour of new typed Component
export function useFormattedEstimate(timestamp) {
  const { showServerTimes } = useStore(settingsStore);
  const [output, setOutput] = useState("");

  useEffect(() => {
    const s = spacetimeBuilder(timestamp, showServerTimes);
    let output = s.format("{month} {year}");

    const date = s.date();
    if (date <= 10) {
      output = `Early ${output}`;
    } else if (date <= 20) {
      output = `Mid ${output}`;
    } else {
      output = `Late ${output}`;
    }

    setOutput(output);
  }, [timestamp, showServerTimes]);

  return output;
}
