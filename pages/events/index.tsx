import { useState } from "react";
import { useStore } from "@nanostores/react";
import { clamp } from "@foxkit/util/clamp";
import { settingsStore } from "src/client/stores/settingsStore";
import { api } from "src/client/api";
import Section from "src/client/components/Section";
import Headline from "src/client/components/Headline";
import { Scroller } from "src/client/components/Scroller";
import Meta from "src/client/components/Meta";
import { EventList } from "src/client/components/EventList";
import { EventsPageProps } from "src/pages/EventsPage/static";
export { getStaticProps } from "src/pages/EventsPage/static";

const noOp = {};

export default function EventsPage({ fallback }: EventsPageProps) {
  const { perPage } = useStore(settingsStore);
  const query = api.events.basic.useQuery(noOp, {
    placeholderData: fallback,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });
  const [page, setPage] = useState<number>(1);

  const isLoading = query.isLoading || !query.data;
  const isError = query.isError;
  const events = query.data ?? fallback;
  const maxPage = Math.ceil(events.length / perPage);
  const lastItemNum = Math.min(page * perPage, events.length);
  const eventsShown = events.slice(0, lastItemNum);

  const handleShowMore = () => {
    setPage(page =>
      clamp({
        value: page + 1,
        max: maxPage
      })
    );
  };

  if (isError) {
    return (
      <Section background>
        <Headline>Internal Server Error</Headline>
        <p>An Error occured while fetching the data for this page</p>
      </Section>
    );
  }

  return (
    <>
      <Meta
        title="Events"
        description="List of current and past events of Fate/Grand Order Global Version"
      />
      <EventList events={eventsShown} title="Events">
        <p>
          Results 1 to {lastItemNum} of {events.length}
        </p>
      </EventList>
      <p>
        Results 1 to {lastItemNum} of {events.length}
      </p>
      {!isLoading && page < maxPage && (
        <Scroller
          handler={handleShowMore}
          handlerMax={() => setPage(maxPage)}
        />
      )}
    </>
  );
}
