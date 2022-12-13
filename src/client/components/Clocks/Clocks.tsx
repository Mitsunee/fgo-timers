import { useStore } from "@nanostores/react";

import styles from "./Clocks.module.css";
import { settingsStore } from "src/client/stores/settingsStore";
import { intervalStore } from "src/client/stores/intervalStore";
import Clock from "./Clock";
import { NoSSR } from "@components/NoSSR";

export default function Clocks() {
  const { alternativeClockFormat } = useStore(settingsStore);
  const { s } = useStore(intervalStore);
  const format = alternativeClockFormat
    ? "{hour-pad}:{minute-pad}{ampm}"
    : "{hour-24-pad}:{minute-pad}";

  // TODO: fix layout shift
  return (
    <NoSSR>
      <section className={styles.wrapper}>
        <Clock title="Local">{s.format(format)}</Clock>
        <Clock title="Server">
          {s.goto("America/Los_Angeles").format(format)}
        </Clock>
      </section>
    </NoSSR>
  );
}
