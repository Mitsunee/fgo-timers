import { Card, TimerList } from "src/client/components/Card";
import type { EventTime } from "./EventListItem";
import { EventListItem } from "./EventListItem";

interface EventTimesCardProps {
  times: EventTime[];
}

export function EventTimesCard({ times }: EventTimesCardProps) {
  return (
    <Card
      icon="/assets/icon_times.png"
      title="Timers"
      id="timers"
      bypassSpoilers>
      <TimerList>
        {times.map((time, i) => (
          <EventListItem key={i} time={time} />
        ))}
      </TimerList>
    </Card>
  );
}
