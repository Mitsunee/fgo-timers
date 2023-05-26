import { DataContext } from "~/client/contexts";
import { CardGrid } from "~/components/Card";
import { EventBannerCard } from "~/pages/EventPage/components/EventBannerCard";
import { EventPageLayout } from "~/pages/EventPage/components/EventPageLayout";
import type { EventBannersPageProps } from "~/pages/EventPage/static/banners";

// Next Page configs
export {
  getStaticPaths,
  getStaticProps
} from "~/pages/EventPage/static/banners";

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
      <DataContext servants={servants} ces={ces}>
        <CardGrid>
          {event.banners.map((banner, idx) => (
            <EventBannerCard key={idx} banner={banner} />
          ))}
        </CardGrid>
      </DataContext>
    </EventPageLayout>
  );
}
