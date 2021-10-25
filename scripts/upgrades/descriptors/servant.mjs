import { latinize } from "modern-diacritics";

import { latinizeOptions } from "../constants.mjs";

const classNameMap = new Map([["alterEgo", "Alter Ego"]]);

export function nameServant(servantData, servantDataNA, niceServant) {
  // find name and generate searchName
  let name =
    servantDataNA?.ascensionAdd.overWriteServantName?.ascension?.["0"] || // spoiler-safe name
    servantDataNA?.name || // english name
    servantData?.ascensionAdd.overWriteServantName?.ascension?.["0"] || // spoiler-safe fan-translated name
    servantData.name; // fan-translated name
  const searchName = latinize(name, latinizeOptions);

  // unique name check
  if (
    niceServant?.jp.filter(
      servant =>
        servant.ascensionAdd.overWriteServantName?.ascension?.["0"] === name ||
        servant.name === name
    ).length > 1
  ) {
    const className =
      classNameMap.get(servantData.className) ??
      servantData.className.replace(/^./, c => c.toUpperCase());

    name = `${name} (${className})`;
  }

  return [name, searchName];
}

export function describeServant(servantData, servantDataNA, niceServant) {
  const [name, search] = nameServant(servantData, servantDataNA, niceServant);

  return {
    id: servantData.id,
    name,
    search,
    icon: servantData.extraAssets.faces.ascension["1"],
    className: servantData.className,
    na: servantDataNA ? true : undefined
  };
}
