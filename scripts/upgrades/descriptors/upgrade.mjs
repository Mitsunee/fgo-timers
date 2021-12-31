import { log } from "@foxkit/node-util/log";

import { fetchQuestData } from "../fetchQuestData.mjs";
import { describeSkill } from "../descriptors/skill.mjs";
import { describeNP } from "../descriptors/np.mjs";
import { describeQuest } from "../descriptors/quest.mjs";
import { nameServant, describeServant } from "../descriptors/servant.mjs";

const PLACEHOLDER_SKILL = {
  id: 0,
  name: null,
  icon: "https://static.atlasacademy.io/NA/SkillIcons/skill_999999.png",
  priority: 0
};

export async function describeUpgrade(
  quest,
  { skills, nps, servants },
  spinner
) {
  // fetch quest data
  const [questData, questDataNA] = await fetchQuestData(quest);

  // handle main quests
  if (questData.type === "main") {
    // this keeps main quest IDs in the data so they aren't fetched everytime
    // the script runs.
    return {
      quest: {
        id: quest,
        open: questDataNA?.openedAt || questData.openedAt
      }
    };
  }

  // find related skills, NPs, servants data
  const relatedSkill = skills.jp.find(
    ({ condQuestId }) => condQuestId === quest
  );
  const relatedNP =
    !relatedSkill && nps.jp.find(({ condQuestId }) => condQuestId === quest);
  const relatedServant = servants.jp.find(({ relateQuestIds }) =>
    relateQuestIds.includes(quest)
  );
  const relatedServantNA = servants.na.find(
    ({ id }) => id === relatedServant.id
  );

  // Quest has related skill
  if (relatedSkill) {
    // find skill on NA
    const relatedSkillNA = skills.na.find(({ id }) => id === relatedSkill.id);

    // find pre-upgrade skill
    const initialSkill = skills.jp.find(
      ({ owner, num, priority }) =>
        owner === relatedServant.id &&
        num === relatedSkill.num &&
        priority === relatedSkill.priority - 1
    );
    const initialSkillNA =
      initialSkill && skills.na.find(({ id }) => id === initialSkill.id);

    // log info
    spinner?.clear();
    log.table({
      type: "Skill Upgrade",
      for: initialSkillNA?.name || initialSkill?.name || "PLACEHOLDER",
      to: relatedSkillNA?.name || relatedSkill.name,
      of: nameServant(relatedServant, relatedServantNA, servants)[0]
    });
    spinner?.start();

    // assemble data
    return {
      target: "skill",
      initial: describeSkill(initialSkill ?? PLACEHOLDER_SKILL, initialSkillNA),
      skill: describeSkill(relatedSkill, relatedSkillNA),
      quest: await describeQuest(questData, questDataNA),
      servant: describeServant(relatedServant, relatedServantNA, servants)
    };
  }

  // Quest has related NP
  if (relatedNP) {
    // find NP on NA
    const relatedNPNA =
      relatedNP && nps.na.find(({ id }) => id === relatedNP.id);

    // find pre-upgrade NP
    const initialNP = nps.jp.find(
      ({ owner, priority }) =>
        owner === relatedServant.id && priority === relatedNP.priority - 1
    );
    const initialNPNA = nps.na.find(({ id }) => id === initialNP.id);

    // log info
    spinner?.clear();
    log.table({
      type: "NP Upgrade",
      for: initialNPNA?.name || initialNP.name,
      to: relatedNPNA?.name || relatedNP.name,
      of: nameServant(relatedServant, relatedServantNA, servants)[0]
    });
    spinner.start();

    // assemble data
    return {
      target: "np",
      initial: describeNP(initialNP, initialNPNA),
      np: describeNP(relatedNP, relatedNPNA),
      quest: await describeQuest(questData, questDataNA),
      servant: describeServant(relatedServant, relatedServantNA, servants)
    };
  }

  // Quest has neither skill nor NP, assume sq interlude
  // log info
  spinner?.clear();
  log.table({
    type: "SQ Interlude",
    of: nameServant(relatedServant, relatedServantNA, servants)[0]
  });
  spinner.start();

  // assemble data
  return {
    target: "sq",
    quest: await describeQuest(questData, questDataNA),
    servant: describeServant(relatedServant, relatedServantNA, servants)
  };
}
