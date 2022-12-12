import type { InferGetStaticPropsType } from "next";
import useSWR, { SWRConfig } from "swr";
import { PropsWithChildren, useMemo, useReducer, useState } from "react";
import { Searcher } from "fast-fuzzy";
import { ClassName } from "@atlasacademy/api-connector";
// @ts-ignore
import FlagEN from "flag-icons/flags/4x3/gb.svg";
// @ts-ignore
import FlagJP from "flag-icons/flags/4x3/jp.svg";

import type { SupportedRegion } from "src/atlas-api/api";
import { getStaticProps } from "src/server/UpgradesPage";
import { fetcher, UpgradesPageData } from "src/server/DataApi";
import { BundledQuest, Upgrade, UpgradeQuestType } from "src/upgrades/types";
import type {
  BundledServant /*,BundledSkill, BundledNP */
} from "src/servants/types";
import {
  classIsExtra,
  getClassIconPath,
  nameServantClass
} from "src/servants/classNames";
import Section from "src/client/components/Section";
import {
  Selector,
  SelectorOption
} from "src/client/components/Selector/Selector";
import { ActionButton } from "src/client/components/Button";
import Meta from "src/client/components/Meta";
import styles from "src/client/styles/UpgradesPage.module.css";
import Input from "@components/Input";

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

const selectableClasses: SelectableClassId[] = [
  ClassName.SABER,
  ClassName.ARCHER,
  ClassName.LANCER,
  ClassName.RIDER,
  ClassName.CASTER,
  ClassName.ASSASSIN,
  ClassName.BERSERKER,
  ClassName.EXTRA
];

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
  classId: Object.fromEntries(
    Array.from(selectableClasses, id => [id, false])
  ) as FormFilterState["classId"]
};

type FormFilterAction =
  | { type: "region"; value: FormFilterState["region"] }
  | { type: "target"; value: FormFilterState["target"] }
  | { type: "type"; value: FormFilterState["type"] }
  | { type: "classId"; value: SelectableClassId };

function filtersReducer(
  state: FormFilterState,
  action: FormFilterAction
): FormFilterState {
  // skip useless rerender
  if (state[action.type] == action.value) return state;

  // deepClone state
  const newState: FormFilterState = { ...state, classId: { ...state.classId } };
  switch (action.type) {
    case "region":
      newState.region = action.value;
      break;
    case "target":
      newState.target = action.value;
      // if new target is "sq" and current type is RANKUP reset type
      if (action.value == "sq" && newState.type == UpgradeQuestType.RANKUP) {
        newState.type = null;
      }
      break;
    case "type":
      newState.type = action.value;
      // if new type is RANKUP and current target is sq reset target
      if (action.value == UpgradeQuestType.RANKUP && newState.target == "sq") {
        newState.target = null;
      }
      break;
    case "classId":
      // boolean toggle selected class
      newState.classId[action.value] = !newState.classId[action.value];
      break;
    default:
      // return old state for unknown action to prevent rerender
      return state;
  }
  return newState;
}

interface FiltersFormProps extends PropsWithChildren {
  filters: FormFilterState;
  setFilter: (action: FormFilterAction) => void;
}

const regionSelectOptions: SelectorOption<FormFilterState["region"]>[] = [
  { value: null, label: "All" },
  { value: "NA", label: "EN", icon: FlagEN.src as string, title: "EN" },
  { value: "JP", label: "JP", icon: FlagJP.src as string, title: "JP" }
];
const targetSelectOptions: SelectorOption<FormFilterState["target"]>[] = [
  { value: null, label: "All" },
  {
    value: "skill",
    label: "Skill",
    icon: "https://static.atlasacademy.io/JP/Items/9.png",
    title: "Skill Upgrade"
  },
  {
    value: "np",
    label: "NPs",
    icon: "https://static.atlasacademy.io/JP/Items/8.png",
    title: "NP Upgrade"
  },
  {
    value: "sq",
    label: "SQ Interludes",
    icon: "https://static.atlasacademy.io/JP/Items/6.png",
    title: "Saint Quartz"
  }
];
const typeSelectOptions: SelectorOption<FormFilterState["type"]>[] = [
  { value: null, label: "All" },
  { value: UpgradeQuestType.INTERLUDE, label: "Interludes" },
  { value: UpgradeQuestType.RANKUP, label: "Rank Ups" }
];

function FiltersForm({ children, filters, setFilter }: FiltersFormProps) {
  return (
    <Section background="blue">
      <form onSubmit={ev => ev.preventDefault()} className={styles.formSection}>
        <fieldset>
          <legend>Region</legend>
          <Selector
            value={filters.region}
            onChange={value => setFilter({ type: "region", value })}
            options={regionSelectOptions}
          />
        </fieldset>
        <fieldset>
          <legend>Upgrade Type</legend>
          <Selector
            value={filters.target}
            onChange={value => setFilter({ type: "target", value })}
            options={targetSelectOptions}
          />
        </fieldset>
        <fieldset>
          <legend>Quest Type</legend>
          <Selector
            value={filters.type}
            onChange={value => setFilter({ type: "type", value })}
            options={typeSelectOptions}
          />
        </fieldset>
        <fieldset>
          <legend>Class</legend>
          {selectableClasses.map(classId => {
            const name = nameServantClass(classId);
            return (
              <ActionButton
                key={name}
                onClick={() => setFilter({ type: "classId", value: classId })}
                decorated={false}
                icon={getClassIconPath(classId)}
                title={name}
                className={[
                  styles.classSel,
                  !filters.classId[classId] && styles.unselected
                ]}
              />
            );
          })}
        </fieldset>
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
  const [searchQuery, setSearchQuery] = useState<string>("");

  const upgrades = res.data!.upgrades;
  const questMap = res.data!.quests as Record<number, BundledQuest>;
  const servantMap = res.data!.servants as Record<number, BundledServant>;
  //const skillMap = res.data!.skills as Record<number, BundledSkill>;
  //const npMap = res.data!.nps as Record<number, BundledNP>;

  /* NOTE:
    - rework pagination maybe? (secondary reducer?; infinite scroll?; aria roles?)
      - is pagination used anywhere other than UpgradesPage?
      - how to handle slice on search results?
      - how to handle reset to page 1 when dataset changes?

    - fast-fuzzy
      - Searcher.search("") gives no results, how to map filteredResults?
      - highlight search subjects based on returnMatchData?
        - returntype does return the string that matched (servant or quest name) + match index and length
      - is it possible to search servant name AND quest name? yes!
        - returntype includes item property with related upgrade object

    - What to print during res.isValidating instead of filter form to describe fallback data?
    - What should fallback data be? (filters must match in getStaticProps and formStateDefault!)
    - How to sort and slice the output?
    - Selectors look a bit awkward on mobile right now
    - onChange happens for dead keys, can be be prevented?
      - there's no prop on events to check such as of right now.
  */

  const [searcher, filteredUpgrades] = useMemo(() => {
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

  if (res.error) {
    // TODO: nicer error
    return <h1>ERROR: {res.error}</h1>;
  }

  // TODO: type properly?
  const results = // TODO: sort and slice output
    res.isValidating || searchQuery == ""
      ? filteredUpgrades.map(upgrade => ({ item: upgrade }))
      : searcher.search(searchQuery);

  return (
    <>
      <FiltersForm filters={filters} setFilter={setFilter}>
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
                .slice(0, 10)
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
