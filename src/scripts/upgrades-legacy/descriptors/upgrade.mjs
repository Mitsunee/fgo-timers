import { log } from "@foxkit/node-util/log";

import { fetchQuestData } from "../fetchQuestData.mjs";
import { findInitialSkill } from "../findInitialSkill.mjs";
import { describeSkill } from "./skill.mjs";
import { describeNP } from "./np.mjs";
import { describeQuest } from "./quest.mjs";
import { nameServant, describeServant } from "./servant.mjs";

const PLACEHOLDER_SKILL = {
  id: 0,
  name: null,
  icon: "https://static.atlasacademy.io/NA/SkillIcons/skill_999999.png",
  priority: 0
};

export async function describeUpgrade(quest, { skills, nps, servants }) {
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
    const initialSkill = findInitialSkill(relatedSkill, skills.jp);
    /*skills.jp.find(
      ({ owner, num, priority }) =>
      owner === relatedServant.id &&
      num === relatedSkill.num &&
      priority === relatedSkill.priority - 1
    );*/
    const initialSkillNA =
      initialSkill && skills.na.find(({ id }) => id === initialSkill.id);

    // log info
    log.table({
      type: "Skill Upgrade",
      for: initialSkillNA?.name || initialSkill?.name || "PLACEHOLDER",
      to: relatedSkillNA?.name || relatedSkill.name,
      of: nameServant(relatedServant, relatedServantNA, servants)[0]
    });

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
    log.table({
      type: "NP Upgrade",
      for: initialNPNA?.name || initialNP.name,
      to: relatedNPNA?.name || relatedNP.name,
      of: nameServant(relatedServant, relatedServantNA, servants)[0]
    });

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
  log.table({
    type: "SQ Interlude",
    of: nameServant(relatedServant, relatedServantNA, servants)[0]
  });

  // assemble data
  return {
    target: "sq",
    quest: await describeQuest(questData, questDataNA),
    servant: describeServant(relatedServant, relatedServantNA, servants)
  };
}
