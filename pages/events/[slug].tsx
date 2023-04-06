import { normalizeDate } from "src/time/normalizeDate";
import { CardGrid } from "src/client/components/Card";
import { EventTimesCard } from "src/pages/EventPage/components/EventTimesCard";
import { EventSchedulesCard } from "src/pages/EventPage/components/EventSchedulesCard";
import { EventPageLayout } from "src/pages/EventPage/components/EventPageLayout";
import type { EventPageProps } from "src/pages/EventPage/static";

// Next Page configs
export { getStaticPaths, getStaticProps } from "src/pages/EventPage/static";

export default function EventPage({
  event,
  servants,
  ces,
  items
}: EventPageProps) {
  const end = normalizeDate(event.date)[1];
  const hasGrid = Boolean(event.schedules || event.times);

  return (
    <EventPageLayout event={event} current="Timers">
      {hasGrid ? (
        <CardGrid>
          {event.times && (
            <EventTimesCard
              times={event.times}
              servants={servants}
              ces={ces}
              items={items}
            />
          )}
          {event.schedules?.map(schedule => (
            <EventSchedulesCard
              key={schedule.title}
              {...schedule}
              eventEnd={end}
              servants={servants}
              ces={ces}
              items={items}
            />
          ))}
        </CardGrid>
      ) : (
        "This Event has no timers"
      )}
    </EventPageLayout>
  );
}
