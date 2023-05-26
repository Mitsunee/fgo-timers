import ClassName from "@atlasacademy/api-connector/dist/Enum/ClassName.js";
import { classIsExtra } from "~/servants/classNames";
import type { BundledServant } from "~/servants/types";
import type { BundledQuest, BundledUpgrade } from "~/upgrades/types";
import type { FormFilterState, SelectableClassId } from "./filtersReducer";

export function createUpgradeFilter(
  filters: FormFilterState,
  servantMap: Record<number, BundledServant>,
  questMap: Record<number, BundledQuest>
) {
  const selectedClasses = new Set(
    (Object.entries(filters.classId) as Array<[SelectableClassId, boolean]>)
      .filter(entry => entry[1])
      .map(entry => entry[0])
  );
  return (upgrade: BundledUpgrade) => {
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
  };
}

export function createUpgradeSorter(questMap: Record<number, BundledQuest>) {
  return (a: BundledUpgrade, b: BundledUpgrade) =>
    questMap[a.quest].open - questMap[b.quest].open;
}
