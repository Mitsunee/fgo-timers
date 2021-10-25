import { questDatesMap } from "./questDatesMap.mjs";
import { nameServant } from "./descriptors/servant.mjs";
import { log } from "../shared/log.mjs";

export function findChangedQuests(data, niceServant) {
  const changedQuests = new Set();
  for (const servant of niceServant.jp) {
    const servantNA = niceServant.na.find(({ id }) => id === servant.id);
    const [servantName] = nameServant(servant, servantNA, niceServant);
    let servantNameChangeLogged = false;

    for (const questId of servant.relateQuestIds) {
      const questCached = data.find(cached => cached.quest.id === questId);
      // new quest
      if (!questCached) {
        log(`Quest ${questId} is new`);
        changedQuests.add(questId);
        continue;
      }

      // servant name changed
      if (servantName !== questCached.servant.name) {
        if (!servantNameChangeLogged) {
          log(
            `Servant Name has changed: '${questCached.servant.name}' => '${servantName}'`
          );
          servantNameChangeLogged = true;
        }

        changedQuests.add(questId);
        continue;
      }

      // quest released on na
      if (
        !questCached.quest.na &&
        servantNA?.relateQuestIds.includes(questId)
      ) {
        log(`Quest ${questId} is new on NA`);
        changedQuests.add(questId);
        continue;
      }

      // quest start date overriden
      if (
        questDatesMap.has(questId) &&
        questDatesMap.get(questId) !== questCached.quest.open
      ) {
        log(`Quest ${questId} open time overriden`);
        changedQuests.add(questId);
        continue;
      }
    }
  }

  return changedQuests;
}
