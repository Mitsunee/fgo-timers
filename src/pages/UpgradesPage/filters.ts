import ClassName from "@atlasacademy/api-connector/dist/Enum/ClassName.js";
import { classIsExtra } from "src/servants/classNames";
import type { BundledServant } from "src/servants/types";
import { Global } from "src/types/enum";
import type { BundledQuest, Upgrade } from "src/upgrades/types";
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
  return (upgrade: Upgrade) => {
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
  return (a: Upgrade, b: Upgrade) =>
    (questMap[a.quest].open ?? 0) +
    (a.na ? 0 : Global.JP_TO_NA_ESTIMATE) -
    (questMap[b.quest].open ?? 0) -
    (b.na ? 0 : Global.JP_TO_NA_ESTIMATE);
}
