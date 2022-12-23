import { useMemo } from "react";
import spacetime from "spacetime";

import { useFormattedSpacetime } from "@utils/hooks/useFormattedSpacetime";

// TODO: phase out in favour of new typed Component
export function useFormattedTimestamp(timestamp, formatName, ignoreSettings) {
  const s = useMemo(() => spacetime(timestamp), [timestamp]);
  const output = useFormattedSpacetime(s, formatName, ignoreSettings);

  return output;
}
