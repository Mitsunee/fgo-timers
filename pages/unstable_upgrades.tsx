import type { InferGetStaticPropsType } from "next";
import useSWR, { SWRConfig } from "swr";
import { PropsWithChildren, useMemo, useReducer, useState } from "react";
import { Searcher } from "fast-fuzzy";
import type { SupportedRegion } from "src/atlas-api/api";
import { getStaticProps } from "src/server/UpgradesPage";
import { fetcher, UpgradesPageData } from "src/server/DataApi";
import { BundledQuest, Upgrade, UpgradeQuestType } from "src/upgrades/types";
import { ClassName } from "@atlasacademy/api-connector";
import {
  BundledServant /*,BundledSkill, BundledNP */
} from "src/servants/types";
import { classIsExtra } from "src/servants/classNames";
import Section from "src/client/components/Section";
import { Selector, SelectorOption } from "@components/Selector/Selector";
//import styles from "src/client/styles/UpgradesPage.module.css";

export { getStaticProps };
type UpgradesPageProps = InferGetStaticPropsType<typeof getStaticProps>;

type SelectableClassId =
  | ClassName.SABER
  | ClassName.ARCHER
  | ClassName.LANCER
  | ClassName.RIDER
  | ClassName.CASTER
  | ClassName.ASSASSIN
  | ClassName.BERSERKER
  | ClassName.EXTRA;

interface FormFilterState {
  region: null | SupportedRegion;
  target: null | "skill" | "np" | "sq";
  type: null | UpgradeQuestType.INTERLUDE | UpgradeQuestType.RANKUP;
  classId: Record<SelectableClassId, boolean>;
}

const formFiltersDefault: FormFilterState = {
  region: "JP",
  target: null,
  type: null,
  classId: {
    [ClassName.SABER]: false,
    [ClassName.ARCHER]: false,
    [ClassName.LANCER]: false,
    [ClassName.RIDER]: false,
    [ClassName.CASTER]: false,
    [ClassName.ASSASSIN]: false,
    [ClassName.BERSERKER]: false,
    [ClassName.EXTRA]: false
  }
};

type FormFilterAction =
  | { type: "region"; value: FormFilterState["region"]; key?: undefined }
  | { type: "target"; value: FormFilterState["target"]; key?: undefined }
  | { type: "type"; value: FormFilterState["type"]; key?: undefined }
  | { type: "classId"; key: SelectableClassId; value: boolean };

function filtersReducer(
  state: FormFilterState,
  action: FormFilterAction
): FormFilterState {
  switch (action.type) {
    case "region":
    case "target":
    case "type":
      return { ...state, [action.type]: action.value };
    case "classId":
      return {
        ...state,
        classId: { ...state.classId, [action.key]: action.value }
      };
  }
}

interface FiltersFormProps extends PropsWithChildren {
  filters: FormFilterState;
  setFilter: (action: FormFilterAction) => void;
}

const regionSelectOptions: SelectorOption<FormFilterState["region"]>[] = [
  { value: null, label: "All" },
  { value: "NA", label: "NA-only" },
  { value: "JP", label: "JP-only" }
];

function FiltersForm({ children, filters, setFilter }: FiltersFormProps) {
  return (
    <Section background="blue">
      <form onSubmit={ev => ev.preventDefault()}>
        Region:{" "}
        <Selector
          value={filters.region}
          onChange={value => setFilter({ type: "region", value })}
          options={regionSelectOptions}
        />
        {children}
      </form>
    </Section>
  );
}

function Page() {
  const res = useSWR("/api/data/upgrades", fetcher<UpgradesPageData>, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const [filters, setFilter] = useReducer(filtersReducer, formFiltersDefault);
  const [searchQuery, _setSearchQuery] = useState<string>("");

  const upgrades = res.data!.upgrades;
  const questMap = res.data!.quests as Record<number, BundledQuest>;
  //const servantMap = res.data!.servants as Record<number, BundledServant>;
  //const skillMap = res.data!.skills as Record<number, BundledSkill>;
  //const npMap = res.data!.nps as Record<number, BundledNP>;

  /* NOTE:
    - rework pagination maybe? (secondary reducer?; infinite scroll?; aria roles?)
      - is pagination used anywhere other than UpgradesPage?
      - how to handle slice on search results?
      - how to handle reset to page 1 when dataset changes?

    - fast-fuzzy
      - highlight search subjects based on returnMatchData?
        - returntype does return the string that matched (servant or quest name) + match index and length
      - is it possible to search servant name AND quest name? yes!
        - returntype includes item property with related upgrade object
      - using fast-fuzzy removes the need for the "search" props, they can be removed

    - What to print during res.isValidating instead of filter form to describe fallback data?
    - What should fallback data be? (filters must match in getStaticProps and formStateDefault!)
  */

  const [_searcher, filteredUpgrades] = useMemo(() => {
    // redefining res.data stuff in this scope so they aren't needed in dependecy array
    const upgrades = res.data!.upgrades;
    const questMap = res.data!.quests as Record<number, BundledQuest>;
    const servantMap = res.data!.servants as Record<number, BundledServant>;
    const selectedClasses = new Set(
      (Object.entries(filters.classId) as Array<[SelectableClassId, boolean]>)
        .filter(entry => entry[1])
        .map(entry => entry[0])
    );
    const filteredUpgrades = res.isValidating
      ? upgrades
      : upgrades.filter(upgrade => {
          const servant = servantMap[upgrade.servant];
          const quest = questMap[upgrade.quest];

          switch (filters.region) {
            case "JP":
              if (upgrade.na) return false;
              break;
            case "NA":
              if (!upgrade.na) return false;
              break;
          }

          switch (filters.target) {
            case "np":
            case "skill":
              if (upgrade.upgrades?.type != filters.target) return false;
              break;
            case "sq":
              if (upgrade.upgrades) return false;
              break;
          }

          if (filters.type && quest.type != filters.type) return false;
          if (selectedClasses.size > 0) {
            if (classIsExtra(servant.classId)) {
              return selectedClasses.has(ClassName.EXTRA);
            }
            return selectedClasses.has(servant.classId as SelectableClassId);
          }

          return true;
        });
    const searcher = new Searcher(filteredUpgrades, {
      returnMatchData: true,
      keySelector: upgrade => [
        servantMap[upgrade.servant].name,
        questMap[upgrade.quest].name
      ]
    });

    return [searcher, filteredUpgrades] as [typeof searcher, Upgrade[]];
  }, [res.isValidating, res.data, filters]);

  // TODO: slice output?

  if (res.error) {
    return <h1>ERROR: {res.error}</h1>;
  }

  return (
    <>
      <FiltersForm filters={filters} setFilter={setFilter}></FiltersForm>
      <code>
        <pre>
          {JSON.stringify(
            {
              request: res.isValidating ? "FETCHING" : "DONE",
              filters,
              filterResults: filteredUpgrades.length,
              totalNum: upgrades.length,
              upgradeJP: upgrades.filter(upgrade => !upgrade.na).length,
              questJP: upgrades.filter(upgrade => !questMap[upgrade.quest].na)
                .length,
              searchQuery,
              upgrades: filteredUpgrades.slice(0, 10)
            },
            null,
            2
          )}
        </pre>
      </code>
    </>
  );
}

export default function UpgradesPage(fallback: UpgradesPageProps) {
  return (
    <SWRConfig value={fallback}>
      <Page />
    </SWRConfig>
  );
}
