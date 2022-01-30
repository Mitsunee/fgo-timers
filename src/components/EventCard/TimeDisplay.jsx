import { useStore } from "@nanostores/react";

import styles from "./TimeDisplay.module.css";
import { intervalStore } from "@stores/intervalStore";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { IconHourglass } from "@components/icons";

export default function TimeDisplay({ start, end = false }) {
  const { seconds: interval } = useStore(intervalStore);
  const target = interval > start ? end || null : start;
  const delta = useFormattedDelta(target * 1000);

  return (
    <div className={styles.time}>
      <IconHourglass className={styles.icon} />
      {end && end < interval
        ? "Ended"
        : target
        ? `${interval > start ? "Ends:" : "Starts:"} ${delta}`
        : "---"}
    </div>
  );
}
