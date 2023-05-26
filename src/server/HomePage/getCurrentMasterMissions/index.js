import { isClamped } from "@foxkit/util/clamp";
import { warn } from "~/server/utils/log";
import { fetchMasterMissions } from "./fetchMasterMissions";
import { parseMasterMission } from "./parseMasterMission";

export async function getCurrentMasterMissions(now) {
  const { weeklyMissions, limitedMissions } = await fetchMasterMissions(now);

  const isActive = ({ startedAt, endedAt }) =>
    isClamped({ value: now, min: startedAt, max: endedAt });

  // find currently active limited missions, sort by start time and parse
  const currentLimited = limitedMissions
    .filter(isActive)
    .sort((a, b) => a.startedAt - b.startedAt)
    .map(mission => parseMasterMission(mission));

  // attempt to find current weekly missions
  let currentWeekly = weeklyMissions.find(isActive);

  // use latest weekly as fallback if no currently active one was found
  if (!currentWeekly) {
    warn("No current weekly Master Missions found - using latest as fallback");
    currentWeekly = weeklyMissions.sort((a, b) => b.startedAt - a.startedAt)[0];
  }

  // parse currentWeekly
  currentWeekly = parseMasterMission(currentWeekly);

  return [currentWeekly, ...currentLimited];
}
