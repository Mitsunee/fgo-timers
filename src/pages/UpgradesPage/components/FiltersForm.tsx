import cc from "classcat";
// @ts-ignore
import FlagEN from "flag-icons/flags/4x3/gb.svg";
// @ts-ignore
import FlagJP from "flag-icons/flags/4x3/jp.svg";
import { ActionButton } from "~/components/Button";
import { Pending } from "~/components/Pending";
import { Selector } from "~/components/Selector";
import { getClassIconPath, nameServantClass } from "~/servants/classNames";
import { UpgradeQuestType } from "~/upgrades/types";
import type { SelectorOption } from "~/components/Selector";
import { selectableClasses } from "../filtersReducer";
import type { FormFilterAction, FormFilterState } from "../filtersReducer";
import styles from "./FiltersForm.module.css";

interface FiltersFormProps extends React.PropsWithChildren {
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
    label: (
      <>
        SQ Inter
        <wbr />
        ludes
      </>
    ),
    icon: "https://static.atlasacademy.io/JP/Items/6.png",
    title: "Saint Quartz"
  }
];
const typeSelectOptions: SelectorOption<FormFilterState["type"]>[] = [
  { value: null, label: "All" },
  {
    value: UpgradeQuestType.INTERLUDE,
    label: (
      <>
        Inter
        <wbr />
        ludes
      </>
    )
  },
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
      <fieldset className={styles.wrap}>
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
