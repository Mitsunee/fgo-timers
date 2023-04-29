import { normalizeDate } from "src/time/normalizeDate";
import { CardGrid } from "src/client/components/Card";
import Section from "src/client/components/Section";
import { EventTimesCard } from "src/pages/EventPage/components/EventTimesCard";
import { EventSchedulesCard } from "src/pages/EventPage/components/EventSchedulesCard";
import { EventPageLayout } from "src/pages/EventPage/components/EventPageLayout";
import type { EventPageProps } from "src/pages/EventPage/static";
import {
  CEContext,
  ItemContext,
  ServantContext,
  CCContext
} from "src/client/contexts";

// Next Page configs
export { getStaticPaths, getStaticProps } from "src/pages/EventPage/static";

type EventPageInnerProps = Pick<EventPageProps, "event">;

function EventPage({ event }: EventPageInnerProps) {
  const end = normalizeDate(event.date)[1];
  const hasGrid = Boolean(event.schedules || event.times);

  return (
    <EventPageLayout event={event} current="Timers">
      {hasGrid ? (
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
      ) : (
        <Section background>This Event has no timers</Section>
      )}
    </EventPageLayout>
  );
}

export default function Page({
  servants,
  ces,
  items,
  ccs,
  event
}: EventPageProps) {
  return (
    <ServantContext value={servants}>
      <CEContext value={ces}>
        <ItemContext value={items}>
          <CCContext value={ccs}>
            <EventPage event={event} />
          </CCContext>
        </ItemContext>
      </CEContext>
    </ServantContext>
  );
}
