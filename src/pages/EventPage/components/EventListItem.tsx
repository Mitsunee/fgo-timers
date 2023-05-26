import {
  BorderedCEIcon,
  BorderedItemIcon,
  BorderedServantIcon
} from "~/client/components/BorderedIcon";
import { TimerListEntities, TimerListItem } from "~/client/components/Card";
import { DisplayDate, DisplayDelta } from "~/client/components/TimeDisplay";
import { useCurrentTime } from "~/client/utils/hooks/useCurrentTime";
import { useIsClient } from "~/client/utils/hooks/useIsClient";
import { CommandCodeIcon } from "~/components/CommandCodeIcon";
import { normalizeDate } from "~/time/normalizeDate";
import type { BundledEvent } from "~/events/types";

export type EventTime = NonNullable<BundledEvent["times"]>[number];

interface EventListItemProps {
  time: EventTime;
  hideEnd?: boolean;
}

export function EventListItem({ time, hideEnd = false }: EventListItemProps) {
  const isClient = useIsClient();
  const [start, end] = normalizeDate(time.date);
  const { current } = useCurrentTime();
  const hasStarted = current >= start;
  const hasEnd = end > 0 && !hideEnd;
  const hasEnded = end > 0 ? current >= end : hasStarted;
  const hasRelatedEntities = Boolean(
    time.servants || time.ces || time.items || time.ccs
  );
  const showDelta = (hideEnd ? !hasStarted : !hasEnded) && isClient;

  return (
    <TimerListItem ended={isClient && hasEnded} title={time.title}>
      {isClient && hasEnd && hasEnded && <li data-wide>Has Ended</li>}
      <li>
        <b>Start{isClient && hasStarted ? "ed" : "s"}:</b>{" "}
        <DisplayDate time={start} />
      </li>
      {hasEnd && (
        <li>
          <b>End{isClient && hasEnded ? "ed" : "s"}:</b>{" "}
          <DisplayDate time={end} />
        </li>
      )}
      {showDelta && (
        <li data-wide>
          <b>{hasEnd ? `${hasStarted ? "End" : "Start"}s in:` : "In:"}</b>{" "}
          <DisplayDelta time={hasStarted ? end : start} />
        </li>
      )}
      {hasRelatedEntities && (
        <TimerListEntities>
          {time.servants?.map(id => (
            <BorderedServantIcon key={id} servantId={id} disableSpoilers />
          ))}
          {time.ces?.map(id => (
            <BorderedCEIcon key={id} ceId={id} disableSpoilers />
          ))}
          {time.items?.map(id => (
            <BorderedItemIcon key={id} itemId={id} disableSpoilers />
          ))}
          {time.ccs?.map(id => (
            <CommandCodeIcon key={id} ccId={id} disableSpoilers />
          ))}
        </TimerListEntities>
      )}
    </TimerListItem>
  );
}
