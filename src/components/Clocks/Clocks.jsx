import { useState, useEffect } from "react";
import { useStore } from "nanostores/react";
import spacetime from "spacetime";

import styles from "./Clocks.module.css";
import { timeFormatsMap } from "@utils/timeFormatsMap";
import { settingsStore } from "@stores/settingsStore";
import Clock from "./Clock";

export default function Clocks({ interval }) {
  const { alternativeClockFormat } = useStore(settingsStore);
  const [times, setTimes] = useState([]);

  useEffect(() => {
    const format = timeFormatsMap.get(
      `clock-${alternativeClockFormat ? 12 : 24}`
    );
    const s = spacetime(interval);

    setTimes([
      { title: "Local", time: s.format(format) },
      { title: "Server", time: s.goto("America/Los_Angeles").format(format) }
    ]);
  }, [alternativeClockFormat, interval]);

  return (
    <section className={styles.wrapper}>
      {times.map(({ title, time }) => (
        <Clock key={title} title={title}>
          {time}
        </Clock>
      ))}
    </section>
  );
}
