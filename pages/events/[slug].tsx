import { useState } from "react";
import Meta from "src/client/components/Meta";
import { Clocks } from "src/client/components/Clocks";
import { ActionButton } from "src/client/components/Button";
import type { EventPageProps } from "src/pages/EventPage/getStaticProps";
import { RelatedUpgrades } from "src/pages/EventPage/components/RelatedUpgrades";
import { EventHero } from "src/pages/EventPage/components/EventHero";
import { EventInfoSection } from "src/pages/EventPage/components/EventInfoSection";
import { EventNewsModal } from "src/pages/EventPage/components/EventNewsModal";

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

export default function EventPage({
  event /*,
  servants,
  ces */
}: EventPageProps) {
  const metaDesc = event.description.split("\n")[0];
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);

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
      {/* DEBUG */}
      <pre>
        <code>{JSON.stringify(event, null, 2)}</code>
      </pre>
      {event.upgrades && showUpgrades ? (
        <RelatedUpgrades upgrades={event.upgrades} />
      ) : (
        <ActionButton onClick={() => setShowUpgrades(true)}>
          Show related Upgrades
        </ActionButton>
      )}
      {showEmbed && (
        <EventNewsModal
          url={event.url}
          closeCallback={() => setShowEmbed(false)}
        />
      )}
    </>
  );
}
