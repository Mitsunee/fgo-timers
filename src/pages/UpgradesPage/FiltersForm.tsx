import cc from "classcat";
import { ClassName } from "@atlasacademy/api-connector";
import type { PropsWithChildren } from "react";
// @ts-ignore
import FlagEN from "flag-icons/flags/4x3/gb.svg";
// @ts-ignore
import FlagJP from "flag-icons/flags/4x3/jp.svg";
import { SupportedRegion } from "src/atlas-api/api";
import { getClassIconPath, nameServantClass } from "src/servants/classNames";
import { UpgradeQuestType } from "src/upgrades/types";
import {
  Selector,
  SelectorOption
} from "src/client/components/Selector/Selector";
import { ActionButton } from "src/client/components/Button";
import styles from "./FiltersForm.module.css";
import Pending from "@components/Pending/Pending";

export type SelectableClassId =
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

export interface FormFilterState {
  region: null | SupportedRegion;
  target: null | "skill" | "np" | "sq";
  type: null | UpgradeQuestType.INTERLUDE | UpgradeQuestType.RANKUP;
  classId: Record<SelectableClassId, boolean>;
}

export const formFiltersDefault: FormFilterState = {
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

export function filtersReducer(
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
  isPending: boolean;
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

export function FiltersForm({
  children,
  filters,
  setFilter,
  isPending
}: FiltersFormProps) {
  return (
    <form
      onSubmit={ev => ev.preventDefault()}
      className={cc([styles.formSection, isPending && styles.isPending])}>
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
      {isPending && <Pending className={styles.pending} />}
    </form>
  );
}
