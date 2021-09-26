import { useState, useEffect } from "react";

import styles from "./Results.module.css";
import { useIsClient } from "@utils/hooks/useIsClient";
import Result from "./Result";
import { Button } from "@components/Button";

export default function Results({ data, formMode }) {
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  useEffect(() => {
    // reset schedule state if mode changes
    if (formMode !== "byNodeCost") setShowFullSchedule(false);
  }, [formMode]);

  // skip calcs and don't render on server
  const isClient = useIsClient();
  if (!isClient) return null;

  // find maxAP result, if not found skip and return null
  const maxAp = data.find(run => run.text === "Max AP");
  if (!maxAp) return null;
  const { from } = maxAp;
  const maxApResult = <Result text="Max AP" time={maxAp.time} from={from} />;

  if (formMode === "byTargetAp") {
    const target = data.find(run => run.text === "Target AP");

    return (
      <div className={styles.resultsWrapper}>
        {target && <Result text="Target AP" time={target.time} from={from} />}
        {maxApResult}
      </div>
    );
  }

  if (formMode === "byNodeCost") {
    // find runs
    const runs = data.filter(run => run.text.startsWith("Run"));
    const handleScheduleToggle = ev => {
      ev.target.blur();
      setShowFullSchedule(state => !state);
    };

    if (showFullSchedule) {
      return (
        <>
          <div className={styles.resultsWrapper}>
            {runs.map(({ text, time }) => (
              <Result key={text} text={text} time={time} from={from} />
            ))}
            {maxApResult}
          </div>
          <Button onClick={handleScheduleToggle}>
            Show only next and final runs
          </Button>
        </>
      );
    }

    // show only next and last run
    const nextRun = runs.find(run => run.time > from);
    const lastRun = runs.sort((a, b) => a.time - b.time)[runs.length - 1];

    // check whether to print next run
    const printNext =
      nextRun && !Object.is(nextRun, maxAp) && !Object.is(nextRun, lastRun);

    return (
      <>
        <div className={styles.resultsWrapper}>
          {printNext && (
            <Result text="Next Run" time={nextRun.time} from={from} />
          )}
          {lastRun && (
            <Result text="Final Run" time={lastRun.time} from={from} />
          )}
          {maxApResult}
        </div>
        <Button onClick={handleScheduleToggle}>Show all runs</Button>
      </>
    );
  }

  // formMode === "byMaxAp"
  return <div className={styles.resultsWrapper}>{maxApResult}</div>;
}
