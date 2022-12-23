import type { Servant } from "@atlasacademy/api-connector/dist/Schema/Servant";
import { atlasCache } from "../atlas-api/cache";
import { nameServantClass } from "./classNames";

const baseNameCache = new Map<number, string>();

let niceServant: Servant[];
let niceServantNA: Servant[];

function stripClassSuffix(name: string): string {
  return name
    .replace(
      / \((?:Saber|Archer|Lancer|Rider|Caster|Assassin|Berserker|Ruler|Avenger|Moon Cancer|Alter(?: |-)Ego|Foreigner|Pretender)\)/i,
      "" // dunno if there's a nicer way to do this
    )
    .replace(/ Alter/, " (Alter)")
    .trim()
    .replace(/ {2,}/g, " ");
}

function getBaseName(servant: Servant): string {
  let cached = baseNameCache.get(servant.id);

  if (!cached) {
    const servantNA = niceServantNA?.find(
      servantNA => servantNA.id == servant.id
    );
    cached = stripClassSuffix(
      servantNA?.ascensionAdd?.overWriteServantName?.ascension?.["0"] ||
        servantNA?.name ||
        servant.ascensionAdd?.overWriteServantName?.ascension?.["0"] ||
        servant.name
    );
    baseNameCache.set(servant.id, cached);
  }

  return cached;
}

export async function nameServant(servantId: number): Promise<string> {
  niceServant ??= await atlasCache.JP.getNiceServant();
  niceServantNA ??= await atlasCache.NA.getNiceServant();

  const servant = niceServant.find(servant => servant.id == servantId)!;
  const baseName = getBaseName(servant);
  let overrideName: string | undefined;

  if (
    niceServant.filter(servant => getBaseName(servant) == baseName).length > 1
  ) {
    overrideName = `${baseName} (${nameServantClass(servant.className)})`;
  }

  if (baseName == "BB") {
    overrideName = `BB (${servant.rarity}* ${nameServantClass(
      servant.className
    )})`;
  }

  return overrideName || baseName;
}
