import { latinize } from "modern-diacritics";

import { latinizeOptions } from "../constants.mjs";
import { fetchQuestData } from "../fetchQuestData.mjs";
import { questDatesMap } from "../questDatesMap.mjs";

function nameQuest(questData, questDataNA) {
  const name = questDataNA?.name || questData.name;

  return [name, latinize(name, latinizeOptions)];
}

export async function describeQuest(questData, questDataNA) {
  const [name, search] = nameQuest(questData, questDataNA);
  const unlock = new Object();
  for (const condition of questData.releaseConditions) {
    // Servant Bond condition
    if (condition.type === "svtFriendship") {
      if (condition.value > 0) {
        unlock.bond = condition.value;
      }
      continue;
    }

    // Servant Ascension condition
    if (condition.type === "svtLimit") {
      if (condition.value > 0) {
        unlock.ascension = condition.value;
      }
      continue;
    }

    // Quest clear condition
    if (condition.type === "questClear") {
      const requiredQuest = await fetchQuestData(condition.targetId);
      const [requiredQuestName] = nameQuest(...requiredQuest);

      // initialize array if it doesn't exist already
      if (unlock.quest == null) unlock.quest = new Array();

      const unlockQuest = {
        name: requiredQuestName,
        id: condition.targetId
      };

      if (requiredQuest[1]) unlockQuest.na = true;

      unlock.quest.push(unlockQuest);
      continue;
    }
  }

  const describedQuest = {
    id: questData.id,
    name,
    search,
    open:
      questDatesMap.get(questData.id) ||
      questDataNA?.openedAt ||
      questData.openedAt,
    type: questData.type === "friendship" ? "interlude" : "rankup",
    unlock
  };

  if (questDataNA) describedQuest.na = true;

  return describedQuest;
}
