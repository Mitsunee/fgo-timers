import { readFileJson } from "@foxkit/node-util/fs";
import path from "path";
import type {
  BundledServant,
  BundledSkill,
  BundledNP
} from "src/servants/types";
import type { BundledQuest, BundledUpgrade } from "src/upgrades/types";
import type {
  BundledCE,
  BundledItem,
  BundledLoginTicket
} from "src/items/types";
import type { BundledEvent } from "src/events/types";
import { Log } from "./log";
import { safeProxyIDMap } from "./proxyIDMap";

export interface StaticBundles {
  servants: Record<number, BundledServant>;
  skills: Record<number, BundledSkill>;
  nps: Record<number, BundledNP>;
  quests: Record<number, BundledQuest>;
  upgrades: BundledUpgrade[];
  ces: Record<number, BundledCE>;
  items: Record<number, BundledItem>;
  events: BundledEvent[];
}

function createBundle<T>(bundlePath: string) {
  const relPath = path.relative(process.cwd(), bundlePath);
  let promise: Promise<T | false> | undefined;
  let cache: T | undefined;
  return async function getBundle(): Promise<T> {
    if (cache) return cache;

    promise ??= readFileJson<T>(bundlePath);
    const data = await promise;
    if (!data) {
      Log.throw(`Could not read bundle at ${relPath}`);
    }

    return (cache ??= data);
  };
}

function withProxy<U>(
  bundle: () => Promise<IDMap<U>>,
  errMessage: string
): () => Promise<Record<number, U>> {
  return async () => safeProxyIDMap(await bundle(), errMessage);
}

export const getBundledServants = createBundle<IDMap<BundledServant>>(
  path.join(process.cwd(), "assets/static/data/servants.json")
);

export const getBundledServantMap = withProxy(
  getBundledServants,
  "Could not find servant %KEY% in bundled data"
);

export const getBundledSkills = createBundle<IDMap<BundledSkill>>(
  path.join(process.cwd(), "assets/static/data/skills.json")
);

export const getBundledSkillMap = withProxy(
  getBundledSkills,
  "Could not find skill %KEY% in bundled data"
);

export const getBundledNPs = createBundle<IDMap<BundledNP>>(
  path.join(process.cwd(), "assets/static/data/nps.json")
);

export const getBundledNPMap = withProxy(
  getBundledNPs,
  "Could not find NP %KEY% in bundled data"
);

export const getBundledQuests = createBundle<IDMap<BundledQuest>>(
  path.join(process.cwd(), "assets/static/data/quests.json")
);

export const getBundledQuestMap = withProxy(
  getBundledQuests,
  "Could not find quest %KEY% in bundle data"
);

export const getBundledUpgrades = createBundle<BundledUpgrade[]>(
  path.join(process.cwd(), "assets/static/upgrades.json")
);

export const getBundledItems = createBundle<IDMap<BundledItem>>(
  path.join(process.cwd(), "assets/static/data/items.json")
);

export const getBundledItemMap = withProxy(
  getBundledItems,
  "Could not find item %KEY% in bundled data"
);

export const getBundledCEs = createBundle<IDMap<BundledCE>>(
  path.join(process.cwd(), "assets/static/data/ces.json")
);

export const getBundledCEMap = withProxy(
  getBundledCEs,
  "Could not find CE %KEY% in bundled data"
);

export const getBundledEvents = createBundle<BundledEvent[]>(
  path.join(process.cwd(), "assets/static/events.json")
);

export const getBundledLoginTickets = createBundle<BundledLoginTicket[]>(
  path.join(process.cwd(), "assets/static/login_tickets.json")
);
