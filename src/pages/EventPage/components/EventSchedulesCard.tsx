import { useMemo } from "react";
import { Card, TimerList } from "~/client/components/Card";
import type { BundledEvent } from "~/events/types";
import { EventListItem } from "./EventListItem";
import type { EventTime } from "./EventListItem";

type EventSchedule = NonNullable<BundledEvent["schedules"]>[number];

interface EventSchedulesCardProps extends EventSchedule {
  eventEnd: number;
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
  const timesMapped = useMemo<EventTime[]>(() => {
    const timesMapped = new Array<EventTime>();

    for (let i = 0; i < times.length; i++) {
      const current = times[i];
      const nextDate = i == times.length - 1 ? end : times[i + 1].date;
      timesMapped.push({
        ...current,
        date: [current.date, nextDate]
      });
    }

    return timesMapped;
  }, [end, times]);

  return (
    <Card
      icon={icon || "/assets/icon_mm.png"}
      title={title}
      id={`schedules-${title.toLowerCase().replace(/ /g, "-")}`}
      bypassSpoilers>
      {description
        ?.split("\n")
        .filter(seg => seg.trim().length > 0)
        .map((seg, i) => (
          <p key={i}>{seg}</p>
        ))}
      <TimerList>
        {timesMapped.map((time, i) => (
          <EventListItem key={i} time={time} hideEnd />
        ))}
      </TimerList>
    </Card>
  );
}
