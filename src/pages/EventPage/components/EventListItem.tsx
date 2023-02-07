import { useStore } from "@nanostores/react";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { intervalStore } from "src/client/stores/intervalStore";
import { normalizeDate } from "src/time/normalizeDate";
import { DisplayDate, DisplayDelta } from "src/client/components/TimeDisplay";
import {
  BorderedCEIcon,
  BorderedItemIcon,
  BorderedServantIcon
} from "src/client/components/BorderedIcon";
import type { BundledEvent } from "src/events/types";
import type { EventPageProps } from "../static";
import styles from "./EventListItem.module.css";

export type EventTime = Exclude<BundledEvent["times"], undefined>[number];
export type WithMaps = Pick<EventPageProps, "servants" | "ces" | "items">;

interface EventListItemProps extends WithMaps {
  time: EventTime;
  hideEnd?: boolean;
}

export function EventListItem({
  time,
  servants,
  ces,
  items,
  hideEnd = false
}: EventListItemProps) {
  const isClient = useIsClient();
  const [start, end] = normalizeDate(time.date);
  const { seconds: current } = useStore(intervalStore);
  const hasStarted = current >= start;
  const hasEnd = end > 0 && !hideEnd;
  const hasEnded = end > 0 ? current >= end : hasStarted;
  const hasRelatedEntities = Boolean(time.servants || time.ces || time.items);
  const showDelta = (hideEnd ? !hasStarted : !hasEnded) && isClient;

  return (
    <li className={isClient && hasEnded ? styles.ended : ""}>
      <h2>{time.title}</h2>
      <ul>
        {isClient && hasEnd && hasEnded && (
          <li className={styles.wide}>Has Ended</li>
        )}
        <li>
          <b>Start{isClient && hasStarted ? "ed" : "s"}:</b>{" "}
          <DisplayDate time={start * 1000} />
        </li>
        {hasEnd && (
          <li>
            <b>End{isClient && hasEnded ? "ed" : "s"}:</b>{" "}
            <DisplayDate time={end * 1000} />
          </li>
        )}
        {showDelta && (
          <li className={styles.wide}>
            <b>{hasEnd ? `${hasStarted ? "End" : "Start"}s in:` : "In:"}</b>{" "}
            <DisplayDelta time={(hasStarted ? end : start) * 1000} />
          </li>
        )}
        {hasRelatedEntities && (
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
              {time.items?.map(id => (
                <BorderedItemIcon
                  key={id}
                  itemId={id}
                  {...items[id]}
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
