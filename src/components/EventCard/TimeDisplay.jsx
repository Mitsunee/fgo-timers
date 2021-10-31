import styles from "./TimeDisplay.module.css";
import { useFormattedDelta } from "@utils/hooks/useFormattedDelta";
import { IconHourglass } from "@components/icons";

export default function TimeDisplay({ startsAt, endsAt = false, interval }) {
  const target = interval > startsAt ? (endsAt ? endsAt : null) : startsAt;
  const delta = useFormattedDelta(interval, target);

  return (
    <div className={styles.time}>
      <IconHourglass className={styles.icon} />
      {target ? `${interval > startsAt ? "Ends:" : "Starts:"} ${delta}` : "---"}
    </div>
  );
}
