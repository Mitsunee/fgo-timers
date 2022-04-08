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

      // servant released on na
      if (
        !questCached.servant.na &&
        niceServant.na.find(servant => servant.id === questCached.servant.id)
      ) {
        changedQuests.add(questId);
        changeReasons.set(
          questId,
          `Servant related to ${questId} is new on NA`
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

    // second pass
    for (const questId of servant.relateQuestIds) {
      if (changedQuests.has(questId)) continue; // already in there

      const questCached = data.find(cached => cached.quest.id === questId);

      if (!questCached) continue;

      if (questCached.unlock?.quest?.some(({ id }) => changedQuests.has(id))) {
        changedQuests.add(questId);
        changeReasons.set(
          questId,
          `Updating Quest ${questId} due to quest unlock condition updating`
        );
      }
    }
  }

  return { changedQuests, changeReasons };
}
