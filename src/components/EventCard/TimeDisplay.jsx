import { useStore } from "@nanostores/react";

import styles from "./TimeDisplay.module.css";
import { intervalStore } from "@stores/intervalStore";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { IconHourglass } from "@components/icons";

export default function TimeDisplay({ startsAt, endsAt = false }) {
  const { interval } = useStore(intervalStore);
  const target = interval > startsAt ? endsAt || null : startsAt;
  const delta = useFormattedDelta(target);

  return (
    <div className={styles.time}>
      <IconHourglass className={styles.icon} />
      {endsAt && endsAt < interval
        ? "Ended"
        : target
        ? `${interval > startsAt ? "Ends:" : "Starts:"} ${delta}`
        : "---"}
    </div>
  );
}
