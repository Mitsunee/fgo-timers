import { useRef, useState, useEffect } from "react";
import { useStore } from "nanostores/react";

import { intervalStore } from "@stores/intervalStore";

export function useRecurringInterval(options) {
  const optionsRef = useRef(null);
  const [nextOccurence, setNextOccurence] = useState(null);
  const { seconds } = useStore(intervalStore);

  // options cached on first render and never updated!
  optionsRef.current ??= options;

  useEffect(() => {
    const { length, offset } = optionsRef.current;

    const next = seconds - ((seconds - offset) % length) + length;

    setNextOccurence(next * 1000);
  }, [seconds]);

  return nextOccurence;
}
