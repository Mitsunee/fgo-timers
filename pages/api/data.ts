import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import type { ResponseError, ResponseData } from "src/server/DataApi";
import {
  getBundledNPs,
  getBundledServants,
  getBundledSkills
} from "src/servants/getBundles";
import { getBundledQuests } from "src/upgrades/getBundles";

// unstable_includeFiles:
path.join(process.cwd(), "assets/static/data/nps.json");
path.join(process.cwd(), "assets/static/data/quests.json");
path.join(process.cwd(), "assets/static/data/servants.json");
path.join(process.cwd(), "assets/static/data/skills.json");

const error: ResponseError = {
  success: false,
  error: "Internal Server Error"
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ResponseError>
) {
  const { query } = req;
  const response: ResponseData = { success: true, data: {} };

  try {
    if (query.servants != undefined) {
      response.data.servants = await getBundledServants();
    }
    if (query.quests != undefined) {
      response.data.quests = await getBundledQuests();
    }
    if (query.skills != undefined) {
      response.data.skills = await getBundledSkills();
    }
    if (query.nps != undefined) {
      response.data.nps = await getBundledNPs();
    }
  } catch {
    return res.status(500).json(error);
  }

  return res.json(response);
}
