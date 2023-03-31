import { CardGrid } from "src/client/components/Card";
import { EventBannerCard } from "src/pages/EventPage/components/EventBannerCard";
import { EventPageLayout } from "src/pages/EventPage/components/EventPageLayout";
import type { EventBannersPageProps } from "src/pages/EventPage/static/banners";

// Next Page configs
export {
  getStaticPaths,
  getStaticProps
} from "src/pages/EventPage/static/banners";
export const config = {
  unstable_includeFiles: [
    "assets/static/events.json",
    "assets/static/data/servants.json",
    "assets/static/data/ces.json"
  ]
};

export default function EventBannersPage({
  event,
  servants,
  ces
}: EventBannersPageProps) {
  return (
    <EventPageLayout
      event={event}
      current="Banners"
      description={`Summoning Banner${
        event.banners.length > 1 ? "s" : ""
      } for ${event.title}`}>
      <h1>Summoning Banners</h1>
      <CardGrid>
        {event.banners.map((banner, idx) => (
          <EventBannerCard
            key={idx}
            banner={banner}
            servants={servants}
            ces={ces}
          />
        ))}
      </CardGrid>
    </EventPageLayout>
  );
}
