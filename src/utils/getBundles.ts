import { readFileJson } from "@foxkit/node-util/fs";
import { join } from "path";
import type {
  BundledServant,
  BundledSkill,
  BundledNP
} from "src/servants/types";
import type { BundledQuest, Upgrade } from "src/upgrades/types";
import type { BundledCE, BundledItem } from "src/items/types";
import type { BundledEvent } from "src/events/types";
import { Log } from "./log";
import { safeProxyIDMap } from "./proxyIDMap";

export interface StaticBundles {
  servants: Record<number, BundledServant>;
  skills: Record<number, BundledSkill>;
  nps: Record<number, BundledNP>;
  quests: Record<number, BundledQuest>;
  upgrades: Upgrade[];
  ces: Record<number, BundledCE>;
  items: Record<number, BundledItem>;
  events: BundledEvent[];
}

function createBundle<T>(path: string) {
  let cache: T | null = null;
  return async function getBundle(): Promise<T> {
    if (cache) return cache;

    const data = await readFileJson<T>(path);
    if (!data) {
      Log.throw(`Could not read bundle at '${path}'`);
    }

    cache = data;
    return data;
  };
}

function withProxy<U>(
  bundle: () => Promise<IDMap<U>>,
  errMessage: string
): () => Promise<Record<number, U>> {
  return async () => safeProxyIDMap(await bundle(), errMessage);
}

export const getBundledServants = createBundle<IDMap<BundledServant>>(
  join("assets", "static", "data", "servants.json")
);

export const getBundledServantMap = withProxy(
  getBundledServants,
  "Could not find servant %KEY% in bundled data"
);

export const getBundledSkills = createBundle<IDMap<BundledSkill>>(
  join("assets", "static", "data", "skills.json")
);

export const getBundledSkillMap = withProxy(
  getBundledSkills,
  "Could not find skill %KEY% in bundled data"
);

export const getBundledNPs = createBundle<IDMap<BundledNP>>(
  join("assets", "static", "data", "nps.json")
);

export const getBundledNPMap = withProxy(
  getBundledNPs,
  "Could not find NP %KEY% in bundled data"
);

export const getBundledQuests = createBundle<IDMap<BundledQuest>>(
  join("assets", "static", "data", "quests.json")
);

export const getBundledQuestMap = withProxy(
  getBundledQuests,
  "Could not find quest %KEY% in bundle data"
);

export const getBundledUpgrades = createBundle<Upgrade[]>(
  join("assets", "static", "upgrades.json")
);

export const getBundledItems = createBundle<IDMap<BundledItem>>(
  join("assets", "static", "data", "items.json")
);

export const getBundledItemMap = withProxy(
  getBundledItems,
  "Could not find item %KEY% in bundled data"
);

export const getBundledCEs = createBundle<IDMap<BundledCE>>(
  join("assets", "static", "data", "ces.json")
);

export const getBundledCEMap = withProxy(
  getBundledCEs,
  "Could not find CE %KEY% in bundled data"
);

export const getBundledEvents = createBundle<BundledEvent[]>(
  join("assets", "static", "events.json")
);
