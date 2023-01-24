import { useState } from "react";
import { ActionButton } from "src/client/components/Button";
import type { EventPageProps } from "src/pages/EventPage/getStaticProps";
import { RelatedUpgrades } from "src/pages/EventPage/components/RelatedUpgrades";
import { CardGrid } from "@components/Card";
import { EventTimesCard } from "src/pages/EventPage/components/EventTimesCard";
import { EventSchedulesCard } from "src/pages/EventPage/components/EventSchedulesCard";
import { EventBannerCard } from "src/pages/EventPage/components/EventBannerCard";
import { EventPageLayout } from "src/pages/EventPage/components/EventPageLayout";
import styles from "src/pages/EventPage/EventPage.module.css";

// Next Page configs
export {
  getStaticPaths,
  getStaticProps
} from "src/pages/EventPage/getStaticProps";
export const config = {
  unstable_includeFiles: [
    "assets/static/events.json",
    "assets/static/data/servants.json",
    "assets/static/data/ces.json"
  ]
};

export default function EventPage({ event, servants, ces }: EventPageProps) {
  const [showUpgrades, setShowUpgrades] = useState(false);
  const end = Array.isArray(event.date) ? event.date[1] : event.date;

  return (
    <EventPageLayout event={event}>
      {(event.schedules || event.times) && (
        <CardGrid className={styles.cardgrid}>
          {event.times && (
            <EventTimesCard times={event.times} servants={servants} ces={ces} />
          )}
          {event.schedules?.map(schedule => (
            <EventSchedulesCard
              key={schedule.title}
              {...schedule}
              eventEnd={end}
            />
          ))}
        </CardGrid>
      )}

      {event.banners && (
        <>
          <h1>Summoning Banners</h1>
          <CardGrid className={styles.cardgrid}>
            {event.banners.map((banner, idx) => (
              <EventBannerCard
                key={idx}
                banner={banner}
                servants={servants}
                ces={ces}
              />
            ))}
          </CardGrid>
        </>
      )}

      {event.upgrades &&
        (showUpgrades ? (
          <>
            <h1>Upgrades</h1>
            <RelatedUpgrades upgrades={event.upgrades} />
          </>
        ) : (
          <ActionButton onClick={() => setShowUpgrades(true)}>
            Show related Upgrades
          </ActionButton>
        ))}
    </EventPageLayout>
  );
}
