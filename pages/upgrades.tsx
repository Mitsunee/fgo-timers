import type { InferGetStaticPropsType } from "next";
import useSWR, { SWRConfig } from "swr";
import { useEffect, useMemo, useReducer, useState } from "react";
import type { MatchData } from "fast-fuzzy";
import { Searcher } from "fast-fuzzy";
import { clamp } from "@foxkit/util/clamp";
import { useStore } from "@nanostores/react";
import { getStaticProps } from "src/pages/UpgradesPage/getStaticProps";
import type { UpgradesPageData } from "src/server/DataApi";
import { fetcher } from "src/server/DataApi";
import type { BundledQuest, Upgrade } from "src/upgrades/types";
import { upgradeIsNPUpgrade, upgradeIsSkillUpgrade } from "src/upgrades/types";
import type {
  BundledServant,
  BundledSkill,
  BundledNP
} from "src/servants/types";
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
import { settingsStore } from "src/client/stores/settingsStore";
import {
  filtersReducer,
  formFiltersDefault
} from "src/pages/UpgradesPage/filtersReducer";
import { FiltersForm } from "src/pages/UpgradesPage/components/FiltersForm";
import {
  createUpgradeFilter,
  createUpgradeSorter
} from "src/pages/UpgradesPage/filters";
import { apiUrl } from "src/pages/UpgradesPage/constants";
import type { Highlight } from "src/pages/UpgradesPage/components";
import { UpgradeCard } from "src/pages/UpgradesPage/components";
import { createQuestUnlockMapper } from "src/pages/UpgradesPage/mapQuestUnlocks";

export { getStaticProps };
type UpgradesPageProps = InferGetStaticPropsType<typeof getStaticProps>;

function Page() {
  const res = useSWR(apiUrl, fetcher<UpgradesPageData>, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { perPage } = useStore(settingsStore);
  const [filters, setFilter] = useReducer(filtersReducer, formFiltersDefault);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [showHelp, setShowHelp] = useState(false);

  const questMap = res.data!.quests as Record<number, BundledQuest>;
  const servantMap = res.data!.servants as Record<number, BundledServant>;
  const skillMap = res.data!.skills as Record<number, BundledSkill>;
  const npMap = res.data!.nps as Record<number, BundledNP>;
  const sorter = createUpgradeSorter(questMap);
  const questMapper = createQuestUnlockMapper(questMap);

  const [searcher, filteredUpgrades] = useMemo(() => {
    // redefining res.data stuff in this scope so they aren't needed in dependecy array
    const upgrades = res.data!.upgrades;
    const servantMap = res.data!.servants as Record<number, BundledServant>;
    const questMap = res.data!.quests as Record<number, BundledQuest>;
    const filter = createUpgradeFilter(filters, servantMap, questMap);
    const filteredUpgrades = res.isValidating
      ? upgrades
      : upgrades.filter(filter);

    const searcher = new Searcher(filteredUpgrades, {
      returnMatchData: true,
      keySelector: upgrade => [
        servantMap[upgrade.servant].name,
        questMap[upgrade.quest].name
      ]
    });

    return [searcher, filteredUpgrades] as [typeof searcher, Upgrade[]];
  }, [res.isValidating, res.data, filters]);

  const results: SemiRequired<MatchData<Upgrade>, "item">[] =
    res.isValidating || searchQuery == ""
      ? filteredUpgrades.sort(sorter).map(upgrade => ({ item: upgrade }))
      : searcher.search(searchQuery);

  const maxPage = Math.ceil(results.length / perPage);
  const handleShowMore = () => {
    setPage(page =>
      clamp({
        value: page + 1,
        max: maxPage
      })
    );
  };

  useEffect(() => {
    setPage(1);
  }, [filters, searchQuery]);

  useEffect(() => {
    setPage(page =>
      clamp({
        value: page,
        max: maxPage
      })
    );
  }, [perPage, maxPage]);

  if (res.error) {
    return (
      <Section background>
        <Headline>Internal Server Error</Headline>
        <p>An Error occured while fetching the data for this page</p>
      </Section>
    );
  }

  return (
    <>
      <Section background="blue">
        <FiltersForm
          filters={filters}
          setFilter={setFilter}
          isPending={res.isValidating}>
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
          Results 1 to {Math.min(page * perPage, results.length)} of{" "}
          {results.length}
        </span>
        <NoSSR>
          <ActionButton onClick={() => setShowHelp(true)} icon={IconHelp}>
            Help
          </ActionButton>
        </NoSSR>
      </div>
      <CardGrid>
        {results.slice(0, page * perPage).map(({ item, match, original }) => {
          const highlight: Highlight = match
            ? { index: match.index, length: match.length, match: original! }
            : {};

          if (upgradeIsSkillUpgrade(item)) {
            const { id: skillId, newId } = item.upgrades;
            return (
              <UpgradeCard
                key={item.quest}
                upgrade={item}
                servant={servantMap[item.servant]}
                quest={questMapper(item.quest)}
                from={skillMap[skillId ?? 0]}
                to={skillMap[newId]}
                {...highlight}
              />
            );
          }

          if (upgradeIsNPUpgrade(item)) {
            const { id: npId, newId } = item.upgrades;
            return (
              <UpgradeCard
                key={item.quest}
                upgrade={item}
                servant={servantMap[item.servant]}
                quest={questMapper(item.quest)}
                from={npMap[npId]}
                to={npMap[newId]}
                {...highlight}
              />
            );
          }

          return (
            <UpgradeCard
              key={item.quest}
              upgrade={item}
              servant={servantMap[item.servant]}
              quest={questMapper(item.quest)}
              {...highlight}
            />
          );
        })}
      </CardGrid>
      <p>
        Results 1 to {Math.min(page * perPage, results.length)} of{" "}
        {results.length}
      </p>
      {!res.isValidating && page < maxPage && (
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

export default function UpgradesPage(fallback: UpgradesPageProps) {
  return (
    <>
      <Meta
        title="Upgrades"
        description="Explore the Interludes and Rank Up Quests of Fate/Grand Order"
      />
      <SWRConfig value={fallback}>
        <Page />
      </SWRConfig>
    </>
  );
}
