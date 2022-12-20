import { useStore } from "@nanostores/react";

import styles from "./Clocks.module.css";
import { intervalStore } from "src/client/stores/intervalStore";
import Clock from "./Clock";
import { NoSSR } from "@components/NoSSR";
import { DisplayDate } from "@components/TimeDisplay";

export default function Clocks() {
  const { interval } = useStore(intervalStore);

  // TODO: fix layout shift
  return (
    <NoSSR>
      <section className={styles.wrapper}>
        <Clock title="Local">
          <DisplayDate format="time" time={interval} serverTz="never" />
        </Clock>
        <Clock title="Server">
          <DisplayDate format="time" time={interval} serverTz="always" />
        </Clock>
      </section>
    </NoSSR>
  );
}
