import { useMemo } from "react";
import { useRecurringInterval } from "src/client/utils/hooks/useRecurringInterval";
import {
  SERVER_DAY_MS_LEN,
  SERVER_DAY_MS_OFFSET,
  SERVER_DAY_ZERO
} from "src/client/utils/globals";
import { DisplayDelta, DisplayDate } from "src/client/components/TimeDisplay";

export default function NextServerMilestone() {
  const next = useRecurringInterval({
    length: SERVER_DAY_MS_LEN,
    offset: SERVER_DAY_MS_OFFSET
  });
  const day = useMemo(() => {
    const s = Math.trunc(next / 1000);
    return Math.trunc((s - SERVER_DAY_ZERO) / SERVER_DAY_MS_LEN) * 100;
  }, [next]);

  return (
    <p>
      Server Day {day} Milestone:
      <br />
      <DisplayDelta time={next} /> (<DisplayDate time={next} format="short" />)
    </p>
  );
}
