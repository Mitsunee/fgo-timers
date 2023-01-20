import spacetime from "spacetime";
import { useStore } from "@nanostores/react";
import type { BundledEvent } from "src/events/types";
import { formatDiff } from "src/utils/formatDiff";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { intervalStore } from "src/client/stores/intervalStore";
import { Card } from "src/client/components/Card";
import type { EventPageProps } from "../getStaticProps";
import { DisplayDate } from "@components/TimeDisplay";
import { BorderedCEIcon, BorderedServantIcon } from "@components/BorderedIcon";
import styles from "./EventTimesCard.module.css";

type EventTime = Exclude<BundledEvent["times"], undefined>;

interface WithMaps {
  servants: EventPageProps["servants"];
  ces: EventPageProps["ces"];
}

interface EventListItemProps extends WithMaps {
  time: EventTime[number];
}

interface EventTimesCardProps extends WithMaps {
  times: EventTime;
}

function EventListItem({ time, servants, ces }: EventListItemProps) {
  const isClient = useIsClient();
  const [start, end = 0] = Array.isArray(time.date) ? time.date : [time.date];
  const { seconds: current, s } = useStore(intervalStore);
  const hasStarted = current >= start;
  const hasEnded = end > 0 ? current >= end : hasStarted;
  const delta = formatDiff(
    s.diff(spacetime((hasStarted ? end : start) * 1000))
  );

  return (
    <>
      {time.title}
      <ul className={styles.list}>
        {isClient ? (
          <>
            <li className={styles.wide}>
              {hasEnded ? (
                "Has Ended"
              ) : (
                <>
                  <b>{hasStarted ? "End" : "Start"}s in:</b> {delta}
                </>
              )}
            </li>
            <li>
              <b>Start{hasStarted ? "ed" : "s"}:</b>{" "}
              <DisplayDate time={start} />
            </li>
            {end > 0 && (
              <li>
                <b>End{hasEnded ? "ed" : "s"}:</b> <DisplayDate time={end} />
              </li>
            )}
          </>
        ) : (
          <>
            <li>
              Starts: <DisplayDate time={start} />
            </li>
            {end > 0 && (
              <li>
                Ends: <DisplayDate time={end} />
              </li>
            )}
          </>
        )}
        {(time.servants || time.ces) && (
          // TODO: disableSpoilers props on BorderedServantIcon and BorderedCEIcon
          <li className={styles.wide}>
            <div className={styles.servants}>
              {time.servants?.map(id => (
                <BorderedServantIcon
                  key={id}
                  servantId={id}
                  {...servants[id]}
                />
              ))}
              {time.ces?.map(id => (
                <BorderedCEIcon key={id} ceId={id} {...ces[id]} />
              ))}
            </div>
          </li>
        )}
      </ul>
    </>
  );
}

export function EventTimesCard({ times, servants, ces }: EventTimesCardProps) {
  return (
    <Card icon="/assets/icon_times.png" title="Timers" bypassSpoilers>
      <ul>
        {times.map((time, i) => (
          <li key={i}>
            <EventListItem time={time} servants={servants} ces={ces} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
