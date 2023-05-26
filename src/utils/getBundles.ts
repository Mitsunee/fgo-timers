import path from "path";
import { readFileJson } from "@foxkit/node-util/fs";
import type { BundledEvent } from "src/events/types";
import type {
  BundledCC,
  BundledCE,
  BundledCostume,
  BundledItem,
  BundledLoginTicket,
  BundledMysticCode
} from "src/items/types";
import type { BundledShop } from "src/schema/ShopSchema";
import type {
  BundledNP,
  BundledServant,
  BundledSkill
} from "src/servants/types";
import type { BundledQuest, BundledUpgrade } from "src/upgrades/types";
import { Log } from "./log";
import { safeProxyDataMap } from "./safeProxyDataMap";

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
  bundle: () => Promise<PartialDataMap<U>>,
  errMessage: string
): () => Promise<DataMap<U>> {
  return async () => safeProxyDataMap(await bundle(), errMessage);
}

export const getBundledServants = createBundle<PartialDataMap<BundledServant>>(
  path.join(process.cwd(), "assets/static/data/servants.json")
);

export const getBundledServantMap = withProxy(
  getBundledServants,
  "Could not find servant %KEY% in bundled data"
);

export const getBundledSkills = createBundle<PartialDataMap<BundledSkill>>(
  path.join(process.cwd(), "assets/static/data/skills.json")
);

export const getBundledSkillMap = withProxy(
  getBundledSkills,
  "Could not find skill %KEY% in bundled data"
);

export const getBundledNPs = createBundle<PartialDataMap<BundledNP>>(
  path.join(process.cwd(), "assets/static/data/nps.json")
);

export const getBundledNPMap = withProxy(
  getBundledNPs,
  "Could not find NP %KEY% in bundled data"
);

export const getBundledQuests = createBundle<PartialDataMap<BundledQuest>>(
  path.join(process.cwd(), "assets/static/data/quests.json")
);

export const getBundledQuestMap = withProxy(
  getBundledQuests,
  "Could not find quest %KEY% in bundle data"
);

export const getBundledUpgrades = createBundle<BundledUpgrade[]>(
  path.join(process.cwd(), "assets/static/upgrades.json")
);

export const getBundledItems = createBundle<PartialDataMap<BundledItem>>(
  path.join(process.cwd(), "assets/static/data/items.json")
);

export const getBundledItemMap = withProxy(
  getBundledItems,
  "Could not find item %KEY% in bundled data"
);

export const getBundledCEs = createBundle<PartialDataMap<BundledCE>>(
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

export const getBundledCCs = createBundle<PartialDataMap<BundledCC>>(
  path.join(process.cwd(), "assets/static/data/ccs.json")
);

export const getBundledCCMap = withProxy(
  getBundledCCs,
  "Could not find CC %KEY% in bundled data"
);

export const getCustomItems = createBundle<PartialDataMap<BundledItem>>(
  path.join(process.cwd(), "assets/static/custom_items.json")
);

export const getCustomItemMap = withProxy(
  getCustomItems,
  "Could not find Custom Item %KEY% in bundled data"
);

export const getBundledShops = createBundle<BundledShop[]>(
  path.join(process.cwd(), "assets/static/shops.json")
);

export const getBundledMysticCodes = createBundle<
  PartialDataMap<BundledMysticCode>
>(path.join(process.cwd(), "assets/static/data/mcs.json"));

export const getBundledMysticCodeMap = withProxy(
  getBundledMysticCodes,
  "Could not find Mystic Code %KEY% in bundled data"
);

export const getBundledCostumes = createBundle<PartialDataMap<BundledCostume>>(
  path.join(process.cwd(), "assets/static/data/costumes.json")
);

export const getBundledCostumeMap = withProxy(
  getBundledCostumes,
  "Could not find Costume %KEY% in bundled data"
);
