import { useState } from "react";
import Meta from "src/client/components/Meta";
import { Clocks } from "src/client/components/Clocks";
import { ActionButton } from "src/client/components/Button";
import type { EventPageProps } from "src/pages/EventPage/getStaticProps";
import { RelatedUpgrades } from "src/pages/EventPage/components/RelatedUpgrades";
import { EventHero } from "src/pages/EventPage/components/EventHero";
import { EventInfoSection } from "src/pages/EventPage/components/EventInfoSection";
import { EventNewsModal } from "src/pages/EventPage/components/EventNewsModal";
import { CardGrid } from "@components/Card";
import { EventTimesCard } from "src/pages/EventPage/components/EventTimesCard";
import { EventSchedulesCard } from "src/pages/EventPage/components/EventSchedulesCard";
import styles from "src/pages/EventPage/EventPage.module.css";
import { EventBannerCard } from "src/pages/EventPage/components/EventBannerCard";

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

// TODO: maybe more info in info section such as amount of banners or upgrades?
export default function EventPage({ event, servants, ces }: EventPageProps) {
  const metaDesc = event.description.split("\n")[0];
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const end = Array.isArray(event.date) ? event.date[1] : event.date;

  return (
    <>
      <Meta
        title={event.title}
        headerTitle="Events"
        image={`/assets/events/${event.banner}`}
        description={
          metaDesc.length > 250 ? `${metaDesc.slice(0, 250)}...` : metaDesc
        }
        headerDescription={`Event Timers for ${event.shortTitle}`}
      />
      <Clocks />
      <EventHero banner={event.banner} title={event.shortTitle} />
      <EventInfoSection
        title={event.title}
        date={event.date}
        description={event.description}
        requires={event.requires}
        modalCallback={() => setShowEmbed(true)}
      />

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

      {showEmbed && (
        <EventNewsModal
          url={event.url}
          closeCallback={() => setShowEmbed(false)}
        />
      )}
    </>
  );
}
