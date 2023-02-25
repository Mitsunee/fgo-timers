import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";
import { Global } from "src/types/enum";

export function useRecurringDaily({ hour }: { hour: number }) {
  const { s } = useCurrentTime("ms");
  const now = s.goto(Global.SERVER_TZ);
  let next: number;

  // if hour hasn't passed yet
  if (now.hour() < hour) {
    // reset is later today
    next = now
      .startOf("day") // reset to beginning of today
      .add(hour, "hours").epoch; // and add hours
  } else {
    // reset for current day already happend
    next = now
      .next("day") // go forward to tomorrow
      .startOf("day") // reset to beginning of the day
      .add(hour, "hours").epoch; // and add hours
  }

  return next;
}
