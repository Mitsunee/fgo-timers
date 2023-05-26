import { useEffect, useMemo, useReducer, useState } from "react";
import { clamp } from "@foxkit/util/clamp";
import { useStore } from "@nanostores/react";
import { Searcher } from "fast-fuzzy";
import type { MatchData } from "fast-fuzzy";
import { api } from "~/client/api";
import { ActionButton } from "~/client/components/Button";
import { CardGrid } from "~/client/components/Card";
import Headline from "~/client/components/Headline";
import { IconAtlas, IconHelp } from "~/client/components/icons";
import { InlineSvg } from "~/client/components/InlineIcon";
import { Input } from "~/client/components/Input";
import Meta from "~/client/components/Meta";
import { Modal, ModalMenu } from "~/client/components/Modal";
import { NoSSR } from "~/client/components/NoSSR";
import { Scroller } from "~/client/components/Scroller";
import Section from "~/client/components/Section";
import { DataContext } from "~/client/contexts";
import { settingsStore } from "~/client/stores/settingsStore";
import { UpgradeCard } from "~/pages/UpgradesPage/components";
import { FiltersForm } from "~/pages/UpgradesPage/components/FiltersForm";
import {
  createUpgradeFilter,
  createUpgradeSorter
} from "~/pages/UpgradesPage/filters";
import {
  filtersReducer,
  formFiltersDefault
} from "~/pages/UpgradesPage/filtersReducer";
import type { Highlight } from "~/pages/UpgradesPage/components";
import type { UpgradesPageProps } from "~/pages/UpgradesPage/getStaticProps";
import type { BundledUpgrade } from "~/upgrades/types";

export { getStaticProps } from "~/pages/UpgradesPage/getStaticProps";

export default function UpgradesPage({ fallback }: UpgradesPageProps) {
  const { perPage } = useStore(settingsStore);
  const query = api.upgrades.all.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });
  const [filters, setFilter] = useReducer(filtersReducer, formFiltersDefault);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showHelp, setShowHelp] = useState(false);

  // query states
  const data = query.data ?? fallback;
  const sorter = createUpgradeSorter(data.quests);
  const isLoading = query.isLoading || !query.data;
  const isError = query.isError;

  // apply filters and create Searcher
  const [searcher, filteredUpgrades] = useMemo(() => {
    const upgrades = data.upgrades;
    const servantMap = data.servants;
    const questMap = data.quests;
    const filter = createUpgradeFilter(filters, servantMap, questMap);
    const filteredUpgrades: BundledUpgrade[] = isLoading
      ? upgrades
      : upgrades.filter(filter);
    const searcher = new Searcher(filteredUpgrades, {
      returnMatchData: true,
      keySelector: upgrade => [
        servantMap[upgrade.servant].name,
        questMap[upgrade.quest].name
      ]
    });

    return [searcher, filteredUpgrades] as const;
  }, [isLoading, data, filters]);

  // apply search
  const results: SemiRequired<MatchData<BundledUpgrade>, "item">[] =
    query.isFetching || searchQuery == ""
      ? filteredUpgrades.sort(sorter).map(upgrade => ({ item: upgrade }))
      : searcher.search(searchQuery);
  const firstResultNum = Math.min(1, results.length);
  const lastResultNum = Math.min(page * perPage, results.length);
  const maxPage = Math.ceil(results.length / perPage);

  // reset page if filters or search changed
  useEffect(() => {
    setPage(1);
  }, [filters, searchQuery]);

  // make sure page is valid if perPage setting is changed
  useEffect(() => {
    setPage(page => clamp({ value: page, max: maxPage }));
  }, [perPage, maxPage]);

  // action handlers
  const handleShowMore = () => {
    setPage(page => clamp({ value: page + 1, max: maxPage }));
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
        title="Upgrades"
        description="Explore the Interludes and Rank Up Quests of Fate/Grand Order"
      />
      <Section background="blue">
        <FiltersForm
          filters={filters}
          setFilter={setFilter}
          isPending={isLoading}>
          <fieldset>
            <legend>Search</legend>
            <Input
              type="text"
              value={searchQuery}
              onChange={ev => setSearchQuery(ev.target.value)}
              placeholder="Servant or Quest name"
            />
          </fieldset>
        </FiltersForm>
      </Section>
      <div
        style={{
          height: 34,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
        <span>
          Results {firstResultNum} to {lastResultNum} of {results.length}
        </span>
        <NoSSR>
          <ActionButton onClick={() => setShowHelp(true)} icon={IconHelp}>
            Help
          </ActionButton>
        </NoSSR>
      </div>
      <DataContext
        servants={data.servants}
        skills={data.skills}
        nps={data.nps}
        quests={data.quests}>
        <CardGrid>
          {results.slice(0, page * perPage).map(({ item, match, original }) => {
            const highlight: Highlight = match
              ? { index: match.index, length: match.length, match: original! }
              : {};

            return (
              <UpgradeCard key={item.quest} upgrade={item} {...highlight} />
            );
          })}
        </CardGrid>
      </DataContext>
      <p>
        Results {firstResultNum} to {lastResultNum} of {results.length}
      </p>
      {!isLoading && page < maxPage && (
        <Scroller
          handler={handleShowMore}
          handlerMax={() => setPage(maxPage)}
        />
      )}
      {showHelp && (
        <Modal labelledBy="help-modal">
          <ModalMenu handleClose={() => setShowHelp(false)}>
            <Headline id="help-modal">Help</Headline>
            <p>
              This page contains information on all Interlude and Rank Up
              Quests. Use the filters and search field to find specific
              Upgrades. The results are either ordered chronologically (oldest
              to newest) or by how closely they match the search query. Use the{" "}
              <InlineSvg icon={IconAtlas} /> buttons to get more info on things
              on the Atlas Academy DB website.
            </p>
            <p>
              The Spoiler System (see Settings) is in effect here and may censor
              names and icons according to your settings. Note that Quest names
              are exempt from this.
            </p>
          </ModalMenu>
        </Modal>
      )}
    </>
  );
}
