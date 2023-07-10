import { getNiceNoblePhantasm } from "~/atlas-api/cache/data/niceNoblePhantasm";
import { mapUpgradeLevelToSkillBorder } from "~/servants/borders";
import { getNPType } from "~/servants/getNPType";
import { getNPOwner } from "~/servants/getOwner";
import { NoblePhantasmsFile } from "~/static/data/noblePhantasms";
import { findEoRNPName } from "~/upgrades/findEoRNPName";
import { getUpgradeLevel } from "~/upgrades/getUpgradeLevel";
import { Log } from "~/utils/log";
import type { BundledNoblePhantasm } from "~/servants/types";
import { DataBundler } from "../utils/dataBundlers";

export const NoblePhantasmsBundle = new DataBundler({
  file: NoblePhantasmsFile,
  transform: async id => {
    const [noblePhantasm, noblePhantasmNA] = await Promise.all([
      getNiceNoblePhantasm(id),
      getNiceNoblePhantasm(id, "NA")
    ]);

    if (!noblePhantasm) {
      Log.error(`Could not find noble phantasm with id ${id}`);
      return;
    }

    const [owner, ownerNA] = await Promise.all([
      getNPOwner(noblePhantasm, "JP"),
      noblePhantasmNA ? getNPOwner(noblePhantasmNA, "NA") : undefined
    ]);

    if (!owner) {
      Log.error(`Could not find owner of noble phantasm with id ${id}`);
      return;
    }

    const name = ownerNA
      ? findEoRNPName(noblePhantasmNA!, ownerNA)
      : findEoRNPName(noblePhantasm, owner);
    const upgradeLevel = getUpgradeLevel(owner, noblePhantasm);

    const data: BundledNoblePhantasm = {
      name,
      type: getNPType(noblePhantasm),
      border: mapUpgradeLevelToSkillBorder(upgradeLevel)
    };

    if (noblePhantasmNA) data.na = true;

    return data;
  }
});

export const bundleNPsData =
  NoblePhantasmsBundle.processBundle.bind(NoblePhantasmsBundle);
