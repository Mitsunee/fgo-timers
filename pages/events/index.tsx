import { useEffect, useMemo, useState } from "react";
import { useStore } from "@nanostores/react";
import { Searcher, sortKind } from "fast-fuzzy";
import { clamp } from "@foxkit/util/clamp";
import { settingsStore } from "src/client/stores/settingsStore";
import { api } from "src/client/api";
import Section from "src/client/components/Section";
import Headline from "src/client/components/Headline";
import { Scroller } from "src/client/components/Scroller";
import Meta from "src/client/components/Meta";
import { EventList } from "src/client/components/EventList";
import { Input } from "src/client/components/Input";
import type { EventsPageProps } from "src/pages/EventsPage/static";
import styles from "src/pages/EventsPage/EventsPage.module.css";
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
  const [searchQuery, setSearchQuery] = useState("");

  const isLoading = query.isLoading || !query.data;
  const isError = query.isError;
  const events = query.data ?? fallback;

  // create searcher
  const searcher = useMemo(() => {
    return new Searcher(events, {
      keySelector: event => [event.title, event.shortTitle],
      threshold: 0.9,
      sortBy: sortKind.insertOrder
    });
  }, [events]);

  // apply search
  const results = searchQuery == "" ? events : searcher.search(searchQuery);
  const firstResultNum = Math.min(1, results.length);
  const lastResultNum = Math.min(page * perPage, results.length);
  const maxPage = Math.ceil(results.length / perPage);

  // reset page if filters or search changed
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // make sure page is valid if perPage setting is changed
  useEffect(() => {
    setPage(page =>
      clamp({
        value: page,
        max: maxPage
      })
    );
  }, [perPage, maxPage]);

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
      <EventList events={results.slice(0, page * perPage)} title="Events">
        <div className={styles.search}>
          <p>
            Results {firstResultNum} to {lastResultNum} of {results.length}
          </p>
          {!isLoading && (
            <Input
              value={searchQuery}
              type="search"
              onChange={ev => setSearchQuery(ev.target.value)}
              placeholder="Search"
            />
          )}
        </div>
      </EventList>
      <p>
        Results {firstResultNum} to {lastResultNum} of {results.length}
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
