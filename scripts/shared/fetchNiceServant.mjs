import { fetchData } from "./fetchData.mjs";
import { ATLAS_API } from "./constants.mjs";

export async function fetchNiceServant() {
  const res = await fetchData(
    [
      `${ATLAS_API}export/JP/nice_servant_lang_en.json`,
      `${ATLAS_API}export/NA/nice_servant.json`
    ],
    undefined,
    "Fetching niceServant data"
  );

  const servantFilter = servant =>
    // filter mash and boss collections
    servant.type === "normal" &&
    // Melusine (304800) uses strengthStatus 0 on everything and priorities break this script
    servant.id !== 304800;

  const na = res[1].filter(servantFilter);
  // save JP data with NA names where possible
  const jp = res[0].filter(servantFilter).map(servant => {
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
