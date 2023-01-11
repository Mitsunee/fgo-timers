import type {
  BundledNP,
  BundledServant,
  BundledSkill
} from "src/servants/types";
import type { BundledQuest, Upgrade } from "src/upgrades/types";
import type { BundledCE, BundledItem } from "src/items/types";
import type { BundledEvent } from "src/events/types";
import {
  getBundledCEs,
  getBundledEvents,
  getBundledItems,
  getBundledNPs,
  getBundledQuests,
  getBundledServants,
  getBundledSkills,
  getBundledUpgrades
} from "src/utils/getBundles";
import { safeProxyIDMap } from "src/utils/proxyIDMap";

export interface StaticBundles {
  servants: Record<number, BundledServant>;
  skills: Record<number, BundledSkill>;
  nps: Record<number, BundledNP>;
  quests: Record<number, BundledQuest>;
  upgrades: Upgrade[];
  items: Record<number, BundledItem>;
  ces: Record<number, BundledCE>;
  events: BundledEvent[];
}

const bundles: Partial<StaticBundles> = {};

export const getBundle: {
  [bundle in keyof StaticBundles]: () => Promise<StaticBundles[bundle]>;
} = {
  servants: async () =>
    (bundles.servants ??= safeProxyIDMap(
      await getBundledServants(),
      "Could not find servant %KEY% in bundled data"
    )),
  skills: async () =>
    (bundles.skills ??= safeProxyIDMap(
      await getBundledSkills(),
      "Could not find skill %KEY% in bundled data"
    )),
  nps: async () =>
    (bundles.nps ??= safeProxyIDMap(
      await getBundledNPs(),
      "Could not find NP %KEY% in bundled data"
    )),
  quests: async () =>
    (bundles.quests ??= safeProxyIDMap(
      await getBundledQuests(),
      "Could not find quest %KEY% in bundled data"
    )),
  upgrades: async () => (bundles.upgrades ??= await getBundledUpgrades()),
  items: async () =>
    (bundles.items ??= safeProxyIDMap(
      await getBundledItems(),
      "Could not find item %KEY% in bundled data"
    )),
  ces: async () =>
    (bundles.ces ??= safeProxyIDMap(
      await getBundledCEs(),
      "Could not find CE %KEY% in bundled data"
    )),
  events: async () => (bundles.events ??= await getBundledEvents())
};
