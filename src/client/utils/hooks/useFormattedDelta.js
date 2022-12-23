import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import spacetime from "spacetime";

import { intervalStore } from "@stores/intervalStore";

// TODO: phase out in favour of new typed Component
export function useFormattedDelta(target) {
  const { s: now } = useStore(intervalStore);
  const [output, setOutput] = useState("");

  useEffect(() => {
    // target can be either a timestamp or spacetime
    const _target = typeof target === "number" ? spacetime(target) : target;

    const diff = now.diff(_target);
    if (diff.seconds > 0) {
      const days = diff.days === 0 ? "" : `${diff.days}d `;
      const hours = diff.hours === 0 ? "" : `${diff.hours % 24}h `;
      const minutes = `${diff.minutes % 60}m `;
      const seconds = `${diff.seconds % 60}s`;
      setOutput(days + hours + minutes + seconds);
    } else {
      setOutput("---");
    }
  }, [now, target]);

  return output;
}
