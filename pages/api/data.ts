import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
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

type ResponseError = { success: false; error: string };
interface ResponseData {
  success: true;
  servants?: Awaited<ReturnType<typeof getBundledServants>>;
  quests?: Awaited<ReturnType<typeof getBundledQuests>>;
  skills?: Awaited<ReturnType<typeof getBundledSkills>>;
  nps?: Awaited<ReturnType<typeof getBundledNPs>>;
}

const error: ResponseError = {
  success: false,
  error: "Internal Server Error"
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ResponseError>
) {
  const { query } = req;
  const response: ResponseData = { success: true };

  try {
    if (query.servants != undefined) {
      response.servants = await getBundledServants();
    }
    if (query.quests != undefined) {
      response.quests = await getBundledQuests();
    }
    if (query.skills != undefined) {
      response.skills = await getBundledSkills();
    }
    if (query.nps != undefined) {
      response.nps = await getBundledNPs();
    }
  } catch {
    return res.status(500).json(error);
  }

  return res.json(response);
}
