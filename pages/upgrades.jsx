import { useReducer, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { latinize } from "modern-diacritics";

import styles from "@styles/UpgradesPage.module.css";
import { settingsStore } from "@stores/settingsStore";
import { matchClassName } from "@utils/matchClassName";
import { usePaginationSlice } from "@utils/hooks/usePaginationSlice";
import { withAddedProps } from "@utils/withAddedProps";
import Pagination from "@components/Pagination";
import Meta from "@components/Meta";
import Section from "@components/Section";
import { Select, SelectOption } from "@components/Select";
import Input from "@components/Input";
import { Button } from "@components/Button";
import CollapsableSection from "@components/CollapsableSection";
import { IconAtlas } from "@components/icons";
import { CardGrid } from "@components/Card";
import UpgradeCard from "@components/UpgradeCard";

export { getStaticProps } from "@server/UpgradesPage/";
//export const config = {
//  unstable_includeFiles: ["assets/data/upgrades/upgrades.json"]
//};

function formUpdateReducer(state, { field, value }) {
  switch (field) {
    case "search":
      return { ...state, search: value, page: 1 };
    case "page":
      return { ...state, page: value };
    case "pageUp":
      return { ...state, page: state.page + 1 };
    case "pageDown":
      return { ...state, page: Math.max(state.page - 1, 0) };
    case "order":
      return { ...state, desc: !state.desc, page: 1 };
    case "region":
      return { ...state, region: value || null, page: 1 };
    case "type":
      return {
        ...state,
        type: value || null,
        page: 1,
        target:
          // reset target if selected type is not interlude and target was sq
          value !== "interlude" && state.target === "sq" ? null : state.target
      };
    case "target":
      return {
        ...state,
        target: value || null,
        page: 1,
        // force type to interlude if selected target is sq
        type: value === "sq" ? "interlude" : state.type
      };
    case "class":
      return {
        ...state,
        classes: {
          ...state.classes,
          [value]: !state.classes[value]
        },
        page: 1
      };
  }
}

const formDefaults = {
  page: 1, // current page: number
  search: "", // text search on servant name and quest title: string
  desc: false, // toggle descending sorting order: boolean
  region: "jp", // region: null | "na" | "jp"
  type: null, // quest type: null | "interlude" | "rankup"
  target: null, // target type: null | "skill" | "np" | "sq"
  classes: {
    saber: false,
    lancer: false,
    archer: false,
    rider: false,
    caster: false,
    assassin: false,
    berserker: false,
    extra: false
  }
};

const sortAsc = (a, b) => a.quest.open - b.quest.open;
const sortDesc = (a, b) => b.quest.open - a.quest.open;

export default function UpgradesPage({ upgradesData }) {
  const [formState, setFormState] = useReducer(formUpdateReducer, formDefaults);
  const { perPage } = useStore(settingsStore);

  // return to page 1 if perPage setting changes (isn't in reducer)
  useEffect(() => {
    setFormState({ field: "page", value: 1 });
  }, [perPage]);

  // scroll to top if page changes
  useEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, [formState.page]);

  const selectedClasses = new Set();
  for (const idx in formState.classes) {
    if (formState.classes[idx]) selectedClasses.add(idx);
  }
  const upgradesList = upgradesData
    .filter(upgrade => {
      // region filter
      if (formState.region === "na" && !upgrade.quest.na) return false;
      if (formState.region === "jp" && upgrade.quest.na) return false;

      // quest type filter
      if (formState.type && formState.type !== upgrade.quest.type) {
        return false;
      }

      // upgrade type (aka target) filter
      if (formState.target && formState.target !== upgrade.target) return false;

      // servant class filter
      if (
        selectedClasses.size > 0 &&
        !matchClassName(upgrade.servant.className, selectedClasses)
      ) {
        return false;
      }

      // search filter
      if (formState.search) {
        const search = latinize(formState.search, {
          lowerCase: true,
          trim: true,
          forceSingleSpace: true,
          replaceWhiteSpace: " "
        });

        if (
          search &&
          !(
            upgrade.servant.search.includes(search) ||
            upgrade.quest.search.includes(search)
          )
        ) {
          return false;
        }
      }

      return true;
    })
    .sort(formState.desc ? sortDesc : sortAsc);

  const [startSlice, endSlice] = usePaginationSlice(
    upgradesList.length,
    formState.page
  );

  const pagination = (
    <Pagination
      elements={upgradesList.length}
      currentPage={formState.page}
      isDesc={formState.desc}
      setPage={page => setFormState({ field: "page", value: page })}
      pageDown={() => setFormState({ field: "pageDown" })}
      pageUp={() => setFormState({ field: "pageUp" })}
      toggleSort={() => setFormState({ field: "order" })}
    />
  );

  return (
    <>
      <Meta
        title="Upgrades"
        description="Explore the Interludes and Rank Up Quests of Fate/Grand Order"
        image="/assets/meta/upgrades.jpg"
      />
      <Section background="blue">
        <div className={styles.formSection}>
          <div className={styles.formItem}>
            <label>Region:</label>
            <Select
              value={formState.region}
              onChange={({ event, value }) => {
                event.target.blur();
                setFormState({ field: "region", value });
              }}>
              <SelectOption value={null}>All</SelectOption>
              <SelectOption value="na">NA-only</SelectOption>
              <SelectOption value="jp">JP-only</SelectOption>
            </Select>
          </div>
          <div className={styles.formItem}>
            <label>Upgrade Type:</label>
            <Select
              value={formState.target}
              onChange={({ event, value }) => {
                event.target.blur();
                setFormState({ field: "target", value });
              }}>
              <SelectOption value={null}>All</SelectOption>
              <SelectOption value="skill">Skill</SelectOption>
              <SelectOption value="np">NPs</SelectOption>
              <SelectOption value="sq">
                SQ Inter
                <wbr />
                ludes
              </SelectOption>
            </Select>
          </div>
          <div className={styles.formItem}>
            <label>Quest Type:</label>
            <Select
              value={formState.type}
              onChange={({ event, value }) => {
                event.target.blur();
                setFormState({ field: "type", value });
              }}>
              <SelectOption value={null}>All</SelectOption>
              <SelectOption value="interlude">
                Inter
                <wbr />
                ludes
              </SelectOption>
              <SelectOption value="rankup">Rank Ups</SelectOption>
            </Select>
          </div>
        </div>
        <div className={styles.formSection}>
          <div className={styles.classSelect}>
            <label>Class:</label>
            <div>
              {Object.keys(formState.classes).map(className => (
                <Button
                  key={className}
                  icon={`/assets/classes/${className}.png`}
                  iconSize="2em"
                  onClick={event => {
                    event.target.blur();
                    setFormState({ field: "class", value: className });
                  }}
                  disableDefaultStyle
                  className={
                    formState.classes[className]
                      ? styles.selected
                      : styles.disabled
                  }
                />
              ))}
            </div>
          </div>
          <div className={styles.formItem}>
            <label htmlFor="upgrade-search">Search:</label>
            <Input
              name="upgrade-search"
              value={formState.search}
              onChange={event =>
                setFormState({ field: "search", value: event.target.value })
              }
            />
          </div>
        </div>
      </Section>
      <CollapsableSection closeable background>
        <p>
          <b>Note:</b> All future release dates are estimates based on JP
          release dates. Things like anniversary and summer will <b>not</b> be
          accurate! Some NA release dates may be inaccurate (DW tends to leave
          the JP date or put a bad placeholder). Feel free to report those on
          discord or github.
        </p>
        <p>
          Use the <IconAtlas className={styles.atlas} /> buttons to see more
          info on Quests and Servants.
        </p>
      </CollapsableSection>
      {withAddedProps(pagination, { props: { top: true } })}
      <CardGrid>
        {upgradesList.slice(startSlice, endSlice).map(upgrade => (
          <UpgradeCard key={upgrade.quest.id} {...upgrade} />
        ))}
      </CardGrid>
      {pagination}
    </>
  );
}
