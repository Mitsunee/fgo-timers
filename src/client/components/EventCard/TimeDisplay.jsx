import { useStore } from "@nanostores/react";
import styles from "./TimeDisplay.module.css";
import { intervalStore } from "src/client/stores/intervalStore";
import { IconHourglass } from "src/client/components/icons";
import { DisplayDelta } from "src/client/components/TimeDisplay";

export default function TimeDisplay({ start, end = undefined }) {
  const { seconds: current } = useStore(intervalStore);
  const target = current > start ? end || null : start;

  return (
    <div className={styles.time}>
      <IconHourglass className={styles.icon} />
      {end && end < current ? (
        "Ended"
      ) : target ? (
        <>
          {current > start ? "Ends: " : "Starts: "}
          <DisplayDelta time={target * 1000} />
        </>
      ) : (
        "---"
      )}
    </div>
  );
}
