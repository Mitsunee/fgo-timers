import styles from "./Results.module.css";
import { useIsClient } from "@utils/hooks/useIsClient";
import Result from "./Result";

export default function Results({ data, formMode }) {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  const maxAp = data.find(run => run.text === "Max AP");
  const { from } = maxAp; // TODO: use this global from on all <Result>s when refactoring that components props

  if (formMode === "byTargetAp") {
    const target = data.find(run => run.text === "Target AP");

    return (
      <div className={styles.resultsWrapper}>
        {target && <Result data={target} />}
        <Result data={maxAp} />
      </div>
    );
  }

  if (formMode === "byNodeCost") {
    // find runs
    const runs = data.filter(run => run.text.startsWith("Run"));
    const nextRun = runs.find(run => run.time > from);
    const lastRun = runs.sort((a, b) => a.time - b.time)[runs.length - 1];

    // prepare data
    const nextData = nextRun && {
      text: "Next Run",
      time: nextRun.time,
      from
    };
    const lastData = lastRun && { text: "Final Run", time: lastRun.time, from };

    // check whether to print next run
    const printNext =
      nextData && !Object.is(nextRun, maxAp) && !Object.is(nextRun, lastRun);

    // TODO: add way to view full schedule

    return (
      <div className={styles.resultsWrapper}>
        {printNext && <Result data={nextData} />}
        {lastData && <Result data={lastData} />}
        <Result data={maxAp} />
      </div>
    );
  }

  // formMode === "byMaxAp"
  return (
    <div className={styles.resultsWrapper}>
      <Result data={maxAp} />
    </div>
  );
}
