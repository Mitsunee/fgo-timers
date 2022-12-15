import type { InferGetStaticPropsType } from "next";
import useSWR, { SWRConfig } from "swr";
import { useEffect, useMemo, useReducer, useState } from "react";
import { MatchData, Searcher } from "fast-fuzzy";
import { getStaticProps } from "src/pages/UpgradesPage/getStaticProps";
import { fetcher, UpgradesPageData } from "src/server/DataApi";
import { BundledQuest, Upgrade } from "src/upgrades/types";
import type {
  BundledServant /*,BundledSkill, BundledNP */
} from "src/servants/types";
import Section from "src/client/components/Section";
import { ActionButton } from "src/client/components/Button";
import Meta from "src/client/components/Meta";
import Input from "src/client/components/Input";
import { clamp } from "@foxkit/util/clamp";
import { useStore } from "@nanostores/react";
import { settingsStore } from "@stores/settingsStore";
import {
  FiltersForm,
  filtersReducer,
  formFiltersDefault
} from "src/pages/UpgradesPage/FiltersForm";
import {
  createUpgradeFilter,
  createUpgradeSorter
} from "src/pages/UpgradesPage/filters";
import { apiUrl } from "src/pages/UpgradesPage/constants";

export { getStaticProps };
type UpgradesPageProps = InferGetStaticPropsType<typeof getStaticProps>;

function Page() {
  const res = useSWR(apiUrl, fetcher<UpgradesPageData>, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { perPage /*, autoInfiniteScroll*/ } = useStore(settingsStore); // TODO: implement autoInfiniteScroll
  const [filters, setFilter] = useReducer(filtersReducer, formFiltersDefault);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const upgrades = res.data!.upgrades;
  const questMap = res.data!.quests as Record<number, BundledQuest>;
  const servantMap = res.data!.servants as Record<number, BundledServant>;
  //const skillMap = res.data!.skills as Record<number, BundledSkill>;
  //const npMap = res.data!.nps as Record<number, BundledNP>;
  const sorter = createUpgradeSorter(questMap);

  /* NOTE:
    - fast-fuzzy
      - Searcher.search("") gives no results, how to map filteredResults?
        - Currently using SemiRequired, will need to use typeguard to check if keys other than item exist
      - highlight search subjects based on returnMatchData?
        - returntype does return the string that matched (servant or quest name) + match index and length
      - is it possible to search servant name AND quest name? yes!
        - returntype includes item property with related upgrade object

    - What to print during res.isValidating instead of filter form to describe fallback data?
    - Selectors look a bit awkward on mobile right now
  */

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
    // TODO: nicer error
    return <h1>ERROR: {res.error}</h1>;
  }

  return (
    <>
      {/* TODO: help button? */}
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
      <code>
        <pre>
          {JSON.stringify(
            {
              request: res.isValidating ? "FETCHING" : "DONE",
              filters,
              filterResults: filteredUpgrades.length,
              totalNum: upgrades.length,
              searchQuery,
              upgrades: results
                .slice(0, page * perPage)
                .map(
                  ({ item: upgrade }) =>
                    `${servantMap[upgrade.servant].name}: [${
                      questMap[upgrade.quest].type
                    }] ${questMap[upgrade.quest].name} (${
                      upgrade.upgrades?.type || "sq"
                    })`
                )
            },
            null,
            2
          )}
        </pre>
      </code>
      {/* PLACEHOLDER: until automatic infinite scroll is implemented */}
      {!res.isValidating && page < maxPage && (
        <>
          <ActionButton onClick={handleShowMore}>
            Show More ({page})
          </ActionButton>
          <ActionButton onClick={() => setPage(maxPage)}>
            Show All ({maxPage})
          </ActionButton>
        </>
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
        image="/assets/meta/upgrades.jpg"
      />
      <SWRConfig value={fallback}>
        <Page />
      </SWRConfig>
    </>
  );
}
