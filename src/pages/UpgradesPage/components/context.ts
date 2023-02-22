import { createContext } from "react";
import type {
  BundledNP,
  BundledServant,
  BundledSkill
} from "src/servants/types";
import type { BundledQuest } from "src/upgrades/types";

type UpgradeContext = {
  servantMap: Record<number, BundledServant>;
  skillMap: Record<number, BundledSkill>;
  npMap: Record<number, BundledNP>;
  questMap: Record<number, BundledQuest>;
};

export const context = createContext<UpgradeContext>({
  servantMap: {},
  skillMap: {},
  npMap: {},
  questMap: {}
});
