import { useRef, useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import spacetime from "spacetime";

import { intervalStore } from "@stores/intervalStore";

export function useRecurringDaily(options) {
  const optionsRef = useRef(null);
  const [nextOccurence, setNextOccurence] = useState(null);
  const { interval } = useStore(intervalStore);

  // options cached on first render and never updated!
  optionsRef.current ??= options;

  useEffect(() => {
    const { hour, tz } = optionsRef.current;
    const now = spacetime(interval, tz || "America/Los_Angeles");

    // if hour hasn't passed yet
    if (now.hour24() < hour) {
      // reset is later today
      const next = now
        .startOf("day") // reset to beginning of today
        .add(hour, "hours"); // and add hours

      setNextOccurence(next.epoch);
    } else {
      // reset for current day already happend
      const next = now
        .next("day") // go forward to tomorrow
        .startOf("day") // reset to beginning of the day
        .add(hour, "hours"); // and add hours

      setNextOccurence(next.epoch);
    }
  }, [interval]);

  return nextOccurence;
}
