import { useMemo } from "react";
import { useStore } from "nanostores/react";
import spacetime from "spacetime";

import { useFormattedSpacetime } from "@utils/hooks/useFormattedSpacetime";
import { settingsStore } from "@stores/settingsStore";

function spacetimeBuilder(timestamp, serverTime) {
  return serverTime
    ? spacetime(timestamp, "America/Los_Angeles")
    : spacetime(timestamp);
}

export function useFormattedTimestamp(timestamp, formatName) {
  const { showServerTimes } = useStore(settingsStore);
  const s = useMemo(
    () => spacetimeBuilder(timestamp, showServerTimes),
    [timestamp, showServerTimes]
  );
  const output = useFormattedSpacetime(s, formatName);

  return output;
}
