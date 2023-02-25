import { useCurrentTime } from "src/client/utils/hooks/useCurrentTime";
import { NoSSR } from "src/client/components/NoSSR";
import { DisplayDate } from "src/client/components/TimeDisplay";
import { Clock } from "./Clock";
import styles from "./Clocks.module.css";

export function Clocks() {
  const { current } = useCurrentTime("ms");

  // TODO: fix layout shift
  return (
    <NoSSR>
      <section className={styles.wrapper}>
        <Clock title="Local">
          <DisplayDate format="time" time={current} serverTz="never" />
        </Clock>
        <Clock title="Server">
          <DisplayDate format="time" time={current} serverTz="always" />
        </Clock>
      </section>
    </NoSSR>
  );
}
