import { DataContext } from "~/client/contexts";
import { CardGrid } from "~/components/Card";
import Section from "~/components/Section";
import { EventPageLayout } from "~/pages/EventPage/components/EventPageLayout";
import { EventSchedulesCard } from "~/pages/EventPage/components/EventSchedulesCard";
import { EventTimesCard } from "~/pages/EventPage/components/EventTimesCard";
import { normalizeDate } from "~/time/normalizeDate";
import type { EventPageProps } from "~/pages/EventPage/static";

// Next Page configs
export { getStaticPaths, getStaticProps } from "~/pages/EventPage/static";

export default function EventPage({
  event,
  servants,
  ces,
  items,
  ccs,
  costumes
}: EventPageProps) {
  const end = normalizeDate(event.date)[1];
  const hasGrid = Boolean(event.schedules || event.times);

  return (
    <EventPageLayout event={event} current="Timers">
      {hasGrid ? (
        <DataContext
          servants={servants}
          ces={ces}
          items={items}
          ccs={ccs}
          costumes={costumes}>
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
