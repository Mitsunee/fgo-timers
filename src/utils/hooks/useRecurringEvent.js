import { useRef, useState, useEffect } from "react";
import spacetime from "spacetime";

export function useRecurringEvent(options, interval) {
  const optionsRef = useRef(null);
  const [nextOccurence, setNextOccurence] = useState(null);

  // options cached on first render and never updated!
  optionsRef.current ??= options;

  useEffect(() => {
    const { day, hour, tz } = optionsRef.current;
    const now = spacetime(interval, tz || "America/Los_Angeles");

    // if today's date is before day OR exactly the day, but hour is smaller
    if (now.date() < day || (now.date() === day && now.hour24() < hour)) {
      // reset is later this month
      // go forward to the start of the next day and add hours
      const next = now
        .date(day, true) // go forward to date of day
        .startOf("day") // reset to beginning of the day
        .add(hour, "hours"); // and add hours

      setNextOccurence(next.epoch);
    } else {
      // reset for current month already happend
      // go to next month and add days and hours
      const next = now
        .next("month")
        .add(day - 1, "days") // -1 because months start on 1
        .add(hour, "hours"); // but hours start at 0

      setNextOccurence(next.epoch);
    }
  }, [interval]);

  return nextOccurence;
}
