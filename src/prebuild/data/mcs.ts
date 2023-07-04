import { getBasicMysticCode } from "~/atlas-api/cache/data/basicMysticCode";
import { shortenAtlasUrl } from "~/atlas-api/urls";
import { MysticCodesFile } from "~/static/data/mysticCodes";
import { Log } from "~/utils/log";
import type { BundledMysticCode } from "~/items/types";
import { DataBundler } from "../utils/dataBundlers";

export const MysticCodesBundle = new DataBundler({
  file: MysticCodesFile,
  transform: async id => {
    const [mysticCode, mysticCodeNA] = await Promise.all([
      getBasicMysticCode(id),
      getBasicMysticCode(id, "NA")
    ]);

    if (!mysticCode) {
      Log.error(`Could not find mystic code with id ${id}`);
      return;
    }

    const data: BundledMysticCode = {
      name: mysticCodeNA?.name || mysticCode.name,
      iconF: shortenAtlasUrl(mysticCode.item.female),
      iconM: shortenAtlasUrl(mysticCode.item.male)
    };

    if (mysticCodeNA) data.na = true;

    return data;
  }
});

export const bundleMysticCodesData =
  MysticCodesBundle.processBundle.bind(MysticCodesBundle);
