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
  const day = Math.ceil((next - SERVER_DAY_ZERO) / SERVER_DAY_MS_LEN) * 100;

  return (
    <p>
      Server Day {day} Milestone:
      <br />
      <DisplayDelta time={next} /> (<DisplayDate time={next} format="short" />)
    </p>
  );
}
