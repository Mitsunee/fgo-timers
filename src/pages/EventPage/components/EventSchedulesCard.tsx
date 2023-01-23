import { useStore } from "@nanostores/react";
import { useIsClient } from "src/client/utils/hooks/useIsClient";
import { intervalStore } from "src/client/stores/intervalStore";
import { Card } from "src/client/components/Card";
import type { BundledEvent } from "src/events/types";
import styles from "./EventSchedulesCard.module.css";
import { DisplayDate, DisplayDelta } from "@components/TimeDisplay";

type EventSchedule = Exclude<BundledEvent["schedules"], undefined>[number];

interface EventScheduleItemProps {
  start: number;
  end: number;
  title: string;
}

interface EventSchedulesCardProps extends EventSchedule {
  eventEnd: number;
}

function EventScheduleItem({ start, end, title }: EventScheduleItemProps) {
  const isClient = useIsClient();
  const { seconds: current } = useStore(intervalStore);
  const hasStarted = current >= start;
  const hasEnded = current >= end;

  return (
    <li className={hasEnded ? styles.ended : ""}>
      <h2>{title}</h2>
      <ul>
        <li>
          <b>Start{isClient && hasStarted ? "ed" : "s"}:</b>{" "}
          <DisplayDate time={start * 1000} />
        </li>
        {isClient && !hasStarted && (
          <li>
            <b>Starts in:</b> <DisplayDelta time={start * 1000} />
          </li>
        )}
      </ul>
    </li>
  );
}

export function EventSchedulesCard({
  title,
  description,
  times,
  ends,
  icon,
  eventEnd
}: EventSchedulesCardProps) {
  const end = ends || eventEnd;

  return (
    <Card icon={icon || "/assets/icon_mm.png"} title={title} bypassSpoilers>
      {description
        ?.split("\n")
        .filter(seg => seg.trim().length > 0)
        .map((seg, i) => (
          <p key={i}>{seg}</p>
        ))}
      <ul>
        {times.map(({ title, date }, idx, self) => {
          const next = idx == self.length - 1 ? end : self[idx + 1].date;
          return (
            <EventScheduleItem
              key={date}
              title={title}
              start={date}
              end={next}
            />
          );
        })}
      </ul>
    </Card>
  );
}
