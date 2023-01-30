import { useStore } from "@nanostores/react";
import type { BundledEvent } from "src/events/types";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { intervalStore } from "src/client/stores/intervalStore";
import { Card } from "src/client/components/Card";
import { DisplayDate, DisplayDelta } from "src/client/components/TimeDisplay";
import {
  BorderedCEIcon,
  BorderedServantIcon
} from "src/client/components/BorderedIcon";
import type { EventPageProps } from "../static";
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
  const { seconds: current } = useStore(intervalStore);
  const hasStarted = current >= start;
  const hasEnded = end > 0 ? current >= end : hasStarted;

  return (
    <li className={hasEnded ? styles.ended : ""}>
      <h2>{time.title}</h2>
      <ul>
        {isClient ? (
          <>
            {end > 0 && hasEnded && <li className={styles.wide}>Has Ended</li>}
            <li>
              <b>Start{hasStarted ? "ed" : "s"}:</b>{" "}
              <DisplayDate time={start * 1000} />
            </li>
            {end > 0 && (
              <li>
                <b>End{hasEnded ? "ed" : "s"}:</b>{" "}
                <DisplayDate time={end * 1000} />
              </li>
            )}
            {isClient && !hasEnded && (
              <li className={styles.wide}>
                <b>
                  {end > 0 ? `${hasStarted ? "End" : "Start"}s in:` : "In:"}
                </b>{" "}
                <DisplayDelta time={(hasStarted ? end : start) * 1000} />
              </li>
            )}
          </>
        ) : (
          <>
            <li>
              Starts: <DisplayDate time={start * 1000} />
            </li>
            {end > 0 && (
              <li>
                Ends: <DisplayDate time={end * 1000} />
              </li>
            )}
          </>
        )}
        {(time.servants || time.ces) && (
          <li className={styles.wide}>
            <div className={styles.entities}>
              {time.servants?.map(id => (
                <BorderedServantIcon
                  key={id}
                  servantId={id}
                  {...servants[id]}
                  disableSpoilers
                />
              ))}
              {time.ces?.map(id => (
                <BorderedCEIcon
                  key={id}
                  ceId={id}
                  {...ces[id]}
                  disableSpoilers
                />
              ))}
            </div>
          </li>
        )}
      </ul>
    </li>
  );
}

export function EventTimesCard({ times, servants, ces }: EventTimesCardProps) {
  return (
    <Card icon="/assets/icon_times.png" title="Timers" bypassSpoilers>
      <ul>
        {times.map((time, i) => (
          <EventListItem key={i} time={time} servants={servants} ces={ces} />
        ))}
      </ul>
    </Card>
  );
}
