import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import type {
  ResponseError,
  ResponseData,
  UpgradesPageData
} from "src/server/DataApi";
import {
  getBundledNPs,
  getBundledServants,
  getBundledSkills,
  getBundledQuests,
  getBundledUpgrades
} from "src/utils/getBundles";

// unstable_includeFiles:
path.join(process.cwd(), "assets/static/upgrades.json");
path.join(process.cwd(), "assets/static/data/nps.json");
path.join(process.cwd(), "assets/static/data/quests.json");
path.join(process.cwd(), "assets/static/data/servants.json");
path.join(process.cwd(), "assets/static/data/skills.json");

const error: ResponseError = {
  success: false as const,
  error: "Internal Server Error"
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ResponseData<UpgradesPageData> | ResponseError>
) {
  try {
    const bundles = await Promise.all([
      getBundledUpgrades(),
      getBundledQuests(),
      getBundledServants(),
      getBundledSkills(),
      getBundledNPs()
    ]);
    const [upgrades, quests, servants, skills, nps] = bundles;
    const data: UpgradesPageData = { upgrades, quests, servants, skills, nps };
    const response = { success: true as const, data };

    return res.json(response);
  } catch {
    return res.status(500).json(error);
  }
}
