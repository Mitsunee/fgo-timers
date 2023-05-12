import { normalizeDate } from "src/time/normalizeDate";
import { CardGrid } from "src/client/components/Card";
import Section from "src/client/components/Section";
import { EventTimesCard } from "src/pages/EventPage/components/EventTimesCard";
import { EventSchedulesCard } from "src/pages/EventPage/components/EventSchedulesCard";
import { EventPageLayout } from "src/pages/EventPage/components/EventPageLayout";
import type { EventPageProps } from "src/pages/EventPage/static";
import { DataContext } from "src/client/contexts";

// Next Page configs
export { getStaticPaths, getStaticProps } from "src/pages/EventPage/static";

export default function EventPage({
  event,
  servants,
  ces,
  items,
  ccs
}: EventPageProps) {
  const end = normalizeDate(event.date)[1];
  const hasGrid = Boolean(event.schedules || event.times);

  return (
    <EventPageLayout event={event} current="Timers">
      {hasGrid ? (
        <DataContext servants={servants} ces={ces} items={items} ccs={ccs}>
          <CardGrid>
            {event.times && <EventTimesCard times={event.times} />}
            {event.schedules?.map(schedule => (
              <EventSchedulesCard
                key={schedule.title}
                {...schedule}
                eventEnd={end}
              />
            ))}
          </CardGrid>
        </DataContext>
      ) : (
        <Section background>This Event has no timers</Section>
      )}
    </EventPageLayout>
  );
}
