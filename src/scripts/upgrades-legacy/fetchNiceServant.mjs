import { getNiceServant } from "@atlas-api/cache.ts";
import { die } from "./die.mjs";

export async function fetchNiceServant() {
  const [niceServant, niceServantNA] = await Promise.all([
    getNiceServant("JP"),
    getNiceServant("NA")
  ]);

  if (!niceServant || !niceServantNA) {
    die("Could not read API cache. Please run: yarn run update:cache");
  }

  const servantFilter = servant =>
    // filter mash and boss collections
    servant.type === "normal" &&
    // Melusine (304800) uses strengthStatus 0 on everything and priorities break this script
    servant.id !== 304800;

  const na = niceServantNA.filter(servantFilter);
  // save JP data with NA names where possible
  const jp = niceServant.filter(servantFilter).map(servant => {
    const servantNA = na.find(servantNA => servantNA.id === servant.id);
    if (!servantNA) return servant;

    // clone and copy name
    const translatedServant = {
      ...servant,
      name: servantNA.name
    };

    // copy spoiler-safe name if possible
    if (servantNA.ascensionAdd.overWriteServantName?.["0"]) {
      translatedServant.ascensionAdd.overWriteServantName =
        servantNA.ascensionAdd.overWriteServantName;
    }

    return translatedServant;
  });

  return { na, jp };
}
