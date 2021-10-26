import { questDatesMap } from "./questDatesMap.mjs";
import { nameServant } from "./descriptors/servant.mjs";

export function findChangedQuests(data, niceServant) {
  const changedQuests = new Set();
  const changeReasons = new Map();
  for (const servant of niceServant.jp) {
    const servantNA = niceServant.na.find(({ id }) => id === servant.id);
    const [servantName] = nameServant(servant, servantNA, niceServant);

    for (const questId of servant.relateQuestIds) {
      const questCached = data.find(cached => cached.quest.id === questId);
      // new quest
      if (!questCached) {
        changedQuests.add(questId);
        changeReasons.set(questId, `Quest ${questId} is new`);
        continue;
      }

      // servant name changed
      if (servantName !== questCached.servant.name) {
        changedQuests.add(questId);
        changeReasons.set(
          questId,
          `Servant Name has changed: '${questCached.servant.name}' => '${servantName}'`
        );
        continue;
      }

      // quest released on na
      if (
        !questCached.quest.na &&
        servantNA?.relateQuestIds.includes(questId)
      ) {
        changedQuests.add(questId);
        changeReasons.set(questId, `Quest ${questId} is new on NA`);
        continue;
      }

      // quest start date overriden
      if (
        questDatesMap.has(questId) &&
        questDatesMap.get(questId) !== questCached.quest.open
      ) {
        changedQuests.add(questId);
        changeReasons.set(questId, `Quest ${questId} open time overriden`);
        continue;
      }
    }
  }

  return { changedQuests, changeReasons };
}
