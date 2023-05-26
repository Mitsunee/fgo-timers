import { Card, TimerList } from "~/client/components/Card";
import { EventListItem } from "./EventListItem";
import type { EventTime } from "./EventListItem";

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
