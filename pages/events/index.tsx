import { useState } from "react";
import { useStore } from "@nanostores/react";
import { clamp } from "@foxkit/util/clamp";
import { settingsStore } from "src/client/stores/settingsStore";
import { api } from "src/client/api";
import { EventsPageProps } from "src/pages/EventsPage/static";
import Section from "@components/Section";
import Headline from "@components/Headline";
import { Scroller } from "@components/Scroller";
import Meta from "@components/Meta";
export { getStaticProps } from "src/pages/EventsPage/static";

const noOp = {};

export default function EventsPage({ fallback }: EventsPageProps) {
  const { perPage } = useStore(settingsStore);
  const {
    data = fallback,
    isLoading,
    isError
  } = api.events.basic.useQuery(noOp, {
    placeholderData: fallback,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });
  const [page, setPage] = useState<number>(1);
  const maxPage = Math.ceil(data.length / perPage);

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
        description="List of current and past events of Fate/Grand Order"
      />
      <p>
        Note: I currently only have 4 events in the data, so pagination cannot
        be tested right now... oops.
      </p>
      {/* DEBUG */}
      <Headline>Debug</Headline>
      <p>
        Results 1 to {Math.min(page * perPage, data.length)} of {data.length}
      </p>
      <code>
        <pre>
          {JSON.stringify(
            {
              isLoading,
              isError,
              data
            },
            null,
            2
          )}
        </pre>
      </code>
      <p>
        Results 1 to {Math.min(page * perPage, data.length)} of {data.length}
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
