import { CardGrid } from "@components/Card";
import { EventBannerCard } from "src/pages/EventPage/components/EventBannerCard";
import { EventPageLayout } from "src/pages/EventPage/components/EventPageLayout";
import type { EventPageProps } from "src/pages/EventPage/static/banners";
import styles from "src/pages/EventPage/EventPage.module.css";

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
}: EventPageProps) {
  return (
    <EventPageLayout event={event} current="Banners">
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
    </EventPageLayout>
  );
}
