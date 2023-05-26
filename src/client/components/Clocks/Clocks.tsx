import { NoSSR } from "~/components/NoSSR";
import { DisplayDate } from "~/components/TimeDisplay";
import { useCurrentTime } from "~/hooks/useCurrentTime";
import { Clock } from "./Clock";
import styles from "./Clocks.module.css";

export function Clocks() {
  const { current } = useCurrentTime();

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
