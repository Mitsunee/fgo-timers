import { useMemo } from "react";

//import styles from "./NextServerMilestone.module.css";
import { useRecurringInterval } from "@utils/hooks/useRecurringInterval";
import {
  SERVER_DAY_MS_LEN,
  SERVER_DAY_MS_OFFSET,
  SERVER_DAY_ZERO
} from "@utils/globals";
import { useFormattedTimestamp } from "@utils/hooks/useFormattedTimestamp";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";

export default function NextServerMilestone({ interval }) {
  const next = useRecurringInterval(
    { length: SERVER_DAY_MS_LEN, offset: SERVER_DAY_MS_OFFSET },
    interval
  );
  const day = useMemo(() => {
    const s = Math.trunc(next / 1000);
    return Math.trunc((s - SERVER_DAY_ZERO) / SERVER_DAY_MS_LEN) * 100;
  }, [next]);
  const date = useFormattedTimestamp(next, "short");
  const delta = useFormattedDelta(interval, next);

  return (
    <p>
      Server Day {day} Milestone:
      <br />
      {delta} ({date})
    </p>
  );
}
