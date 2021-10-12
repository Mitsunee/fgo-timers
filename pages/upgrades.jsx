import { useReducer } from "react";
import { parseJsonFile } from "@utils/server/parseJsonFile";

import styles from "@styles/UpgradesPage.module.css";
import Meta from "@components/Meta";
//import { CardGrid } from "@components/Card";
import Section from "@components/Section";
import { Select, SelectOption } from "@components/Select";
import Input from "@components/Input";
import UpgradeCard from "@components/UpgradeCard";

function formUpdateReducer(state, { field, value }) {
  switch (field) {
    case "search":
      return { ...state, search: value, page: 0 };
    case "pageUp":
      return { ...state, page: state.page + 1 };
    case "pageDown":
      return { ...state, page: Math.max(state.page - 1, 0) };
    case "order":
      return {
        ...state,
        order: value || state.order === "asc" ? "desc" : "asc"
      };
    case "region":
      return { ...state, region: value || null, page: 0 };
    case "type":
      return {
        ...state,
        type: value || null,
        page: 0,
        target:
          // reset target if selected type is not interlude and target was sq
          value !== "interlude" && state.target === "sq" ? null : state.target
      };
    case "target":
      return {
        ...state,
        target: value || null,
        page: 0,
        // force type to interlude if selected target is sq
        type: value === "sq" ? "interlude" : state.type
      };
  }
}

export default function UpgradesPage({ upgradesData }) {
  const [formState, setFormState] = useReducer(formUpdateReducer, {
    page: 0, // page index: number
    search: "", // text search on servant name and quest title: string
    desc: false, // toggle descending sorting order: boolean // TODO: implement
    region: "jp", // region: null | "na" | "jp"
    type: null, // quest type: null | "interlude" | "rankup"
    target: null // target type: null | "skill" | "np" | "sq"
  });

  // TODO: fuse.js search
  // const search = useMemo fuse.js search
  const upgradesList = upgradesData.filter(upgrade => {
    // region filter
    if (formState.region === "na" && !upgrade.quest.na) return false;
    if (formState.region === "jp" && upgrade.quest.na) return false;

    // quest type filter
    if (formState.type && formState.type !== upgrade.quest.type) {
      return false;
    }
    // upgrade type (aka target) filter
    if (formState.target && formState.target !== upgrade.target) return false;

    return true;
  });

  return (
    <>
      <Meta
        title="Upgrades"
        description="Explore the Interludes and Rank Up Quests of Fate/Grand Order"
      />
      {/* WIP: form */}
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
              <SelectOption value="sq">SQ Interludes</SelectOption>
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
              <SelectOption value="interlude">Interludes</SelectOption>
              <SelectOption value="rankup">Rank Ups</SelectOption>
            </Select>
          </div>
        </div>
        <div className={styles.formSection}>
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
      {/* TODO:
       * Pagination
       * proper output display
       * Result number like: n to m (of p)
      <CardGrid>
      */}
      {/* DEBUG */}
      {formState.search.trim() && (
        <p>Search: &apos;{formState.search.trim()}&apos;</p>
      )}
      <p>{upgradesList.length} Results</p>
      <ul>
        {upgradesList.slice(0, 24).map(upgrade => (
          <UpgradeCard key={upgrade.quest.id} {...upgrade} />
        ))}
      </ul>
      {/*
      </CardGrid>
      */}
    </>
  );
}

export async function getStaticProps() {
  const upgradesData = await parseJsonFile(
    "assets/data/upgrades/upgrades.json"
  );

  return {
    props: {
      // TEMP: sort in SSG until sorting option is implemented
      // NOTE: sorting needs to recognize jp-only quests and add magic number!
      // filter out main quests
      upgradesData: upgradesData
        .filter(upgrade => upgrade.target)
        .sort(({ quest: { open: a } }, { quest: { open: b } }) => a - b)
    }
  };
}
