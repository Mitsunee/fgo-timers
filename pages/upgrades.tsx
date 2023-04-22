import { useEffect, useMemo, useReducer, useState } from "react";
import type { MatchData } from "fast-fuzzy";
import { Searcher } from "fast-fuzzy";
import { clamp } from "@foxkit/util/clamp";
import { useStore } from "@nanostores/react";
import type { BundledUpgrade } from "src/upgrades/types";
import { settingsStore } from "src/client/stores/settingsStore";
import { api } from "src/client/api";
import {
  NPContext,
  QuestContext,
  ServantContext,
  SkillContext
} from "src/client/contexts";
import Meta from "src/client/components/Meta";
import Section from "src/client/components/Section";
import { NoSSR } from "src/client/components/NoSSR";
import { ActionButton } from "src/client/components/Button";
import { Input } from "src/client/components/Input";
import { CardGrid } from "src/client/components/Card";
import { Scroller } from "src/client/components/Scroller";
import { Modal, ModalMenu } from "src/client/components/Modal";
import Headline from "src/client/components/Headline";
import { InlineSvg } from "src/client/components/InlineIcon";
import { IconHelp, IconAtlas } from "src/client/components/icons";
import {
  filtersReducer,
  formFiltersDefault
} from "src/pages/UpgradesPage/filtersReducer";
import { FiltersForm } from "src/pages/UpgradesPage/components/FiltersForm";
import {
  createUpgradeFilter,
  createUpgradeSorter
} from "src/pages/UpgradesPage/filters";
import type { Highlight } from "src/pages/UpgradesPage/components";
import { UpgradeCard } from "src/pages/UpgradesPage/components";
import type { UpgradesPageProps } from "src/pages/UpgradesPage/getStaticProps";

export { getStaticProps } from "src/pages/UpgradesPage/getStaticProps";

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

  const Contexts = (props: React.PropsWithChildren) => (
    <ServantContext value={data.servants}>
      <SkillContext value={data.skills}>
        <NPContext value={data.nps}>
          <QuestContext value={data.quests}>{props.children}</QuestContext>
        </NPContext>
      </SkillContext>
    </ServantContext>
  );

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
      <Contexts>
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
      </Contexts>
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
