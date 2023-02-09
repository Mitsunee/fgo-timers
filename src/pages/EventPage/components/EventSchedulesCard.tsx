import { useMemo } from "react";
import { Card } from "src/client/components/Card";
import type { BundledEvent } from "src/events/types";
import { EventListItem } from "./EventListItem";
import type { WithMaps, EventTime } from "./EventListItem";

type EventSchedule = Exclude<BundledEvent["schedules"], undefined>[number];

interface EventSchedulesCardProps extends EventSchedule, WithMaps {
  eventEnd: number;
}

export function EventSchedulesCard({
  title,
  description,
  times,
  ends,
  icon,
  eventEnd,
  servants,
  ces,
  items
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
    <Card icon={icon || "/assets/icon_mm.png"} title={title} bypassSpoilers>
      {description
        ?.split("\n")
        .filter(seg => seg.trim().length > 0)
        .map((seg, i) => (
          <p key={i}>{seg}</p>
        ))}
      <ul>
        {timesMapped.map((time, i) => (
          <EventListItem
            key={i}
            time={time}
            servants={servants}
            ces={ces}
            items={items}
            hideEnd
          />
        ))}
      </ul>
    </Card>
  );
}
