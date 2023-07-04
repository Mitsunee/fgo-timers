import { getBasicCommandCode } from "~/atlas-api/cache/data/basicCommandCode";
import { shortenAtlasUrl } from "~/atlas-api/urls";
import { mapCCRarityToBorder } from "~/items/types";
import { CommandCodesFile } from "~/static/data/commandCodes";
import { Log } from "~/utils/log";
import type { BundledCC } from "~/items/types";
import { DataBundler } from "../utils/dataBundlers";

export const CommandCodesBundle = new DataBundler({
  file: CommandCodesFile,
  transform: async id => {
    const [commandCode, commandCodeNA] = await Promise.all([
      getBasicCommandCode(id),
      getBasicCommandCode(id, "NA")
    ]);

    if (!commandCode) {
      Log.error(`Could not find command code with id ${id}`);
      return;
    }

    const data: BundledCC = {
      name: commandCodeNA?.name || commandCode.name,
      icon: shortenAtlasUrl(commandCode.face),
      rarity: commandCode.rarity,
      border: mapCCRarityToBorder(commandCode.rarity)
    };

    if (commandCodeNA) data.na = true;

    return data;
  }
});

export const bundleCCsData =
  CommandCodesBundle.processBundle.bind(CommandCodesBundle);
