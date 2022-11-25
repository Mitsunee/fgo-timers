import { useStore } from "@nanostores/react";

import styles from "./Clocks.module.css";
import { timeFormatsMap } from "@utils/timeFormatsMap";
import { settingsStore } from "@stores/settingsStore";
import { intervalStore } from "@stores/intervalStore";
import Clock from "./Clock";

export default function Clocks() {
  const { alternativeClockFormat } = useStore(settingsStore);
  const { s } = useStore(intervalStore);
  const format = timeFormatsMap.get(
    `clock-${alternativeClockFormat ? 12 : 24}`
  )!;

  return (
    <section className={styles.wrapper}>
      <Clock title="Local">{s.format(format)}</Clock>
      <Clock title="Server">
        {s.goto("America/Los_Angeles").format(format)}
      </Clock>
    </section>
  );
}
