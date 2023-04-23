import { List } from "@foxkit/util/object";
import { atlasCache } from "../../atlas-api/cache";
import { shortenAtlasUrl } from "../../atlas-api/urls";
import { Log } from "../../utils/log";
import type { DataBundler } from "../utils/dataBundlers";
import { mapCCRarityToBorder } from "../../items/types";
import type { BundledCC } from "../../items/types";

export const bundleCCsData: DataBundler<BundledCC> = async ids => {
  const [basicCC, basicCCNA] = await Promise.all([
    atlasCache.JP.getCommandCodes(),
    atlasCache.NA.getCommandCodes()
  ]);

  const ccQueue = List.fromArray([...ids]); // to be processed
  const res = new Map<number, BundledCC>(); // result of processing

  let ccId: number | undefined;
  while ((ccId = ccQueue.shift())) {
    const cc = basicCC.find(cc => cc.id == ccId);
    if (!cc) {
      Log.error(`Could not find cc id ${ccId}`);
      return false;
    }

    const ccNA = basicCCNA.find(ccNA => ccNA.id == ccId);
    const data: BundledCC = {
      name: ccNA?.name || cc.name,
      icon: shortenAtlasUrl(cc.face),
      rarity: cc.rarity,
      border: mapCCRarityToBorder(cc.rarity)
    };

    if (ccNA) data.na = true;

    res.set(ccId, data);
  }

  Log.info(`Mapped data for ${res.size} CCs`);
  return {
    name: "Command Codes",
    path: "ccs.json",
    data: res
  };
};
