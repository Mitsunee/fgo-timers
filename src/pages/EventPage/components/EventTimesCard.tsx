import { Card, TimerList } from "src/client/components/Card";
import type { WithMaps, EventTime } from "./EventListItem";
import { EventListItem } from "./EventListItem";

interface EventTimesCardProps extends WithMaps {
  times: EventTime[];
}

export function EventTimesCard({
  times,
  servants,
  ces,
  items
}: EventTimesCardProps) {
  return (
    <Card icon="/assets/icon_times.png" title="Timers" bypassSpoilers>
      <TimerList>
        {times.map((time, i) => (
          <EventListItem
            key={i}
            time={time}
            servants={servants}
            ces={ces}
            items={items}
          />
        ))}
      </TimerList>
    </Card>
  );
}
