import { readFileJson } from "@foxkit/node-util/fs";
import { join } from "path";
import type {
  BundledNP,
  BundledServant,
  BundledSkill
} from "src/servants/types";
import type { BundledQuest, Upgrade } from "src/upgrades/types";
import type { BundledCE, BundledItem } from "src/items/types";
import type { BundledEvent } from "src/events/types";
import { Log } from "./log";

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

export const getBundledServants = createBundle<IDMap<BundledServant>>(
  join("assets", "static", "data", "servants.json")
);

export const getBundledSkills = createBundle<IDMap<BundledSkill>>(
  join("assets", "static", "data", "skills.json")
);

export const getBundledNPs = createBundle<IDMap<BundledNP>>(
  join("assets", "static", "data", "nps.json")
);

export const getBundledQuests = createBundle<IDMap<BundledQuest>>(
  join("assets", "static", "data", "quests.json")
);

export const getBundledUpgrades = createBundle<Upgrade[]>(
  join("assets", "static", "upgrades.json")
);

export const getBundledItems = createBundle<IDMap<BundledItem>>(
  join("assets", "static", "data", "items.json")
);

export const getBundledCEs = createBundle<IDMap<BundledCE>>(
  join("assets", "static", "data", "ces.json")
);

export const getBundledEvents = createBundle<BundledEvent[]>(
  join("assets", "static", "events.json")
);
