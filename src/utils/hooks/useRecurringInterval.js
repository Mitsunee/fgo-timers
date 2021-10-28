import { useRef, useState, useEffect } from "react";

export function useRecurringInterval(options, interval) {
  const optionsRef = useRef(null);
  const [nextOccurence, setNextOccurence] = useState(null);

  // options cached on first render and never updated!
  optionsRef.current ??= options;

  useEffect(() => {
    const { length, offset } = optionsRef.current;

    const s = Math.trunc(interval / 1000);
    const next = s - ((s - offset) % length) + length;

    setNextOccurence(next * 1000);
  }, [interval]);

  return nextOccurence;
}
