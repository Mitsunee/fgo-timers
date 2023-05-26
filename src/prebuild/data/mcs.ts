import { List } from "@foxkit/util/object";
import { atlasCache } from "~/atlas-api/cache";
import { shortenAtlasUrl } from "~/atlas-api/urls";
import { Log } from "~/utils/log";
import type { BundledMysticCode } from "~/items/types";
import type { DataBundler } from "../utils/dataBundlers";

export const bundleMysticCodesData: DataBundler<
  BundledMysticCode
> = async ids => {
  const [basicMysticCode, basicMysticCodeNA] = await Promise.all([
    atlasCache.JP.getMysticCodes(),
    atlasCache.NA.getMysticCodes()
  ]);

  const mcQueue = List.fromArray([...ids]); // to be processed
  const res = new Map<number, BundledMysticCode>(); // result of processing

  let mcId: number | undefined;
  while ((mcId = mcQueue.shift())) {
    const mc = basicMysticCode.find(mc => mc.id == mcId);
    if (!mc) {
      Log.error(`Could not find mc id ${mcId}`);
      return false;
    }

    const mcNA = basicMysticCodeNA.find(mcNA => mcNA.id == mcId);
    const data: BundledMysticCode = {
      name: mcNA?.name || mc.name,
      iconF: shortenAtlasUrl(mc.item.female),
      iconM: shortenAtlasUrl(mc.item.male)
    };

    if (mcNA) data.na = true;

    res.set(mcId, data);
  }

  Log.info(`Mapped data for ${res.size} Mystic Codes`);
  return {
    name: "Mystic Codes",
    path: "mcs.json",
    data: res
  };
};
