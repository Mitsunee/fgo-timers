import { getBasicCommandCode } from "~/atlas-api/cache/data/basicCommandCode";
import { shortenAtlasUrl } from "~/atlas-api/urls";
import { CommandCodesFile } from "~/static/data/commandCodes";
import { Borders } from "~/types/borders";
import { Log } from "~/utils/log";
import type { BundledCommandCode } from "~/items/types";
import { DataBundler } from "../utils/dataBundlers";

/**
 * Maps non-zero rarity to CCBorder and CCBackground
 * @params rarity
 * @returns Borders enum value
 */
export function mapCCRarityToBorder(
  rarity: number
): BundledCommandCode["border"] {
  switch (rarity) {
    case 1:
    case 2:
      return Borders.BRONZE;
    case 3:
      return Borders.SILVER;
    default:
      return Borders.GOLD;
  }
}

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

    const data: BundledCommandCode = {
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
