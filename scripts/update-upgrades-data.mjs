import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import chalk from "chalk";
import fetch from "node-fetch";

// TODO: figure out a workaround for Jekyll&Hyde
// TODO: figure out a workaround for EoR skills

// globals
const CWD = process.cwd();
const ATLAS = "https://api.atlasacademy.io/";
const borderColors = new Map([
  [1, "black"],
  [2, "gold"],
  [3, "red"],
  [101, "black"],
  [102, "gold"],
  [103, "red"]
]);
const PLACEHOLDER_SKILL = {
  id: 0,
  name: null,
  icon: "https://assets.atlasacademy.io/GameData/JP/SkillIcons/skill_999999.png",
  priority: 0
};

// helper functions
const join = relPath => path.join(CWD, relPath);
const log = message => console.log(message);
log.error = message => console.error(chalk.red(message));
log.warn = message => console.warn(chalk.yellow(message));
log.success = message => console.log(chalk.cyan(message));
log.debug = arg => {
  if (typeof arg === "string") {
    return console.log(arg);
  }
  const temp = {};
  for (const key in arg) {
    temp[key] =
      typeof arg[key] === "object"
        ? arg[key] instanceof Array
          ? "array"
          : "object"
        : arg[key];
  }
  console.table(temp);
};
const die = message => {
  if (message) log.error(message);
  process.exit(1);
};
const fetchData = async (url, defaultValue) => {
  const _fetch = async (url, defaultValue) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (defaultValue === undefined) die("error while fetching " + url);
        return defaultValue;
      }
      return await res.json();
    } catch (e) {
      if (defaultValue === undefined) die(e);
      return defaultValue;
    }
  };
  if (url instanceof Array) {
    return await Promise.all(
      url.map(async item => await _fetch(item, defaultValue))
    );
  }
  return await _fetch(url, defaultValue);
};
const fetchNiceServant = async () => {
  const res = await fetchData([
    `${ATLAS}export/JP/nice_servant_lang_en.json`,
    `${ATLAS}export/NA/nice_servant.json`
  ]);
  return res.map(data =>
    data
      .filter(servant => servant.type === "normal")
      .filter(
        // Jekyll&Hyde (600700) literally turns into an NP as part of his NP, which is not currently supported
        // Melusine (304800) uses strengthStatus 0 on everything and priorities break this script
        ({ id }) => ![600700, 304800].includes(id)
      )
  );
};
const sleep = time =>
  new Promise(resolve => setTimeout(() => resolve(), time ?? 250));

// descriptors
const describeSkill = (skillData, skillDataNA) => ({
  name: skillDataNA?.name || skillData.name,
  num: skillData.num,
  icon: skillData.icon,
  border: borderColors.get(skillData.priority),
  na: skillDataNA ? true : undefined
});
const describeNP = (npData, npDataNA) => ({
  name: npDataNA?.name || npData.name,
  type: npData.card,
  border: borderColors.get(npData.priority),
  na: npDataNA ? true : undefined
});
const nameServant = (servantData, servantDataNA) => {
  return (
    servantDataNA?.ascensionAdd.overWriteServantName?.ascension?.["0"] || // spoiler-safe name
    servantDataNA?.name || // english name
    servantData?.ascensionAdd.overWriteServantName?.ascension?.["0"] || // spoiler-safe fan-translated name
    servantData.name // fan-translated name
  );
};
const describeServant = (servantData, servantDataNA) => ({
  name: nameServant(servantData, servantDataNA),
  icon: servantData.extraAssets.faces.ascension["1"],
  className: servantData.className,
  na: servantDataNA ? true : undefined
});
const describeQuest = (questData, questDataNA) => ({
  id: questData.id,
  name: questDataNA?.name || questData.name,
  open: questDataNA?.openedAt || questData.openedAt,
  type: questData.type === "friendship" ? "interlude" : "rankup",
  unlock: {
    bond:
      questData.releaseConditions?.find(({ type }) => type === "svtFriendship")
        ?.value ?? 0,
    ascension:
      questData.releaseConditions?.find(({ type }) => type === "svtLimit")
        ?.value ?? 0,
    quest:
      questData.releaseConditions?.find(({ type }) => type === "questClear")
        ?.value ?? undefined
  },
  na: questDataNA ? true : undefined
});

async function main() {
  // read existing data
  let data = [];
  try {
    const fileContent = await fs.readFile(
      join("assets/data/upgrades/upgrades.json"),
      "utf8"
    );
    data = JSON.parse(fileContent);
  } catch (err) {
    log.warn(err);
  }

  // fetch nice servant data
  const [niceServant, niceServantNA] = await fetchNiceServant();
  const skills = niceServant.flatMap(servant =>
    servant.skills.map(skill => ({ ...skill, owner: servant.id }))
  );
  const skillsNA = niceServantNA.flatMap(servant =>
    servant.skills.map(skill => ({ ...skill, owner: servant.id }))
  );
  const nps = niceServant.flatMap(servant =>
    servant.noblePhantasms
      .map(np => ({ ...np, owner: servant.id }))
      .filter(({ num }) => num === 1)
  );
  const npsNA = niceServantNA.flatMap(servant =>
    servant.noblePhantasms
      .map(np => ({ ...np, owner: servant.id }))
      .filter(({ num }) => num === 1)
  );

  // compare quest IDs to find any that changed
  const knownQuests = data.map(upgrade => upgrade.quest.id);
  const knownQuestsNA = data
    .filter(upgrade => upgrade.quest.na)
    .map(upgrade => upgrade.quest.id);
  const changedQuests = [
    ...niceServant
      .flatMap(servant => servant.relateQuestIds)
      .filter(quest => !knownQuests.includes(quest)),
    ...niceServantNA
      .flatMap(servant => servant.relateQuestIds)
      .filter(quest => !knownQuestsNA.includes(quest))
  ].filter((v, i, s) => s.indexOf(v) === i);

  // if nothing changed quit with success
  if (changedQuests.length === 0) {
    log.success(`Data is already up-to-date (total: ${data.length})`);
    return 0;
  }

  const newUpgrades = [];

  for (const quest of changedQuests) {
    await sleep(); // atlas api can't handle too many requests in a row

    // fetch quest data
    log.debug(`Fetching quest: ${quest}`);
    const [questData, questDataNA] = await fetchData(
      [`${ATLAS}nice/JP/quest/${quest}`, `${ATLAS}nice/NA/quest/${quest}`],
      false // needs defaultValue as NA quest may not exist!
    );
    if (!questData) die("Error while fetching atlas API"); // but we need JP to exist

    // handle main quests
    if (questData.type === "main") {
      // this keeps main quest IDs in the data so they aren't fetched everytime
      // the script runs.
      // TODO: filter out main quests like filter(upgrade => upgrade.target) in SSG
      const upgrade = {
        quest: {
          id: quest
        }
      };

      newUpgrades.push(upgrade);
      continue;
    }

    // find related skills, NPs, servants data
    const relatedSkill = skills.find(
      ({ condQuestId }) => condQuestId === quest
    );
    const relatedNP =
      !relatedSkill && nps.find(({ condQuestId }) => condQuestId === quest);
    const relatedServant = niceServant.find(({ relateQuestIds }) =>
      relateQuestIds.includes(quest)
    );
    const relatedServantNA = niceServantNA.find(
      ({ id }) => id === relatedServant.id
    );

    // Quest has related skill
    if (relatedSkill) {
      log.debug("Quest upgrades a skill");
      // find skill on NA
      const relatedSkillNA = skillsNA.find(({ id }) => id === relatedSkill.id);

      // find pre-upgrade skill
      const initialSkill = skills.find(
        ({ owner, num, priority }) =>
          owner === relatedServant.id &&
          num === relatedSkill.num &&
          priority === relatedSkill.priority - 1
      );
      const initialSkillNA =
        initialSkill && skillsNA.find(({ id }) => id === initialSkill.id);

      // print log
      log.debug({
        for: initialSkillNA?.name || initialSkill?.name || "PLACEHOLDER",
        to: relatedSkillNA?.name || relatedSkill.name,
        of: nameServant(relatedServant, relatedServantNA)
      });

      // assemble data
      newUpgrades.push({
        target: "skill",
        initial: describeSkill(
          initialSkill ?? PLACEHOLDER_SKILL,
          initialSkillNA
        ),
        skill: describeSkill(relatedSkill, relatedSkillNA),
        quest: describeQuest(questData, questDataNA),
        servant: describeServant(relatedServant, relatedServantNA)
      });
      continue;
    }

    // Quest has related NP
    if (relatedNP) {
      log.debug("Quest upgrades NP");
      // find NP on NA
      const relatedNPNA =
        relatedNP && npsNA.find(({ id }) => id === relatedNP.id);

      // find pre-upgrade NP
      const initialNP = nps.find(
        ({ owner, priority }) =>
          owner === relatedServant.id && priority === relatedNP.priority - 1
      );
      const initialNPNA = npsNA.find(({ id }) => id === initialNP.id);

      // print log
      log.debug({
        for: initialNPNA?.name || initialNP.name,
        to: relatedNPNA?.name || relatedNP.name,
        of: nameServant(relatedServant, relatedServantNA)
      });

      newUpgrades.push({
        target: "np",
        initial: describeNP(initialNP, initialNPNA),
        np: describeNP(relatedNP, relatedNPNA),
        quest: describeQuest(questData, questDataNA),
        servant: describeServant(relatedServant, relatedServantNA)
      });
      continue;
    }

    // Quest has neither skill nor NP, assume sq interlude
    log.debug("Quest only rewards Saint Quartz");
    newUpgrades.push({
      target: "sq",
      quest: describeQuest(questData, questDataNA),
      servant: describeServant(relatedServant, relatedServantNA)
    });
  }

  data = [
    ...data.filter(({ quest }) => !changedQuests.includes(quest.id)),
    ...newUpgrades
  ];

  // write file
  await fs.writeFile(
    join("assets/data/upgrades/upgrades.json"),
    JSON.stringify(data),
    "utf8"
  );
  log.success(
    `Updated data for ${newUpgrades.length} quests (total: ${data.length})`
  );

  // return success
  return 0;
}

// make sure script is ran from project root
if (CWD.includes("node_modules") || !existsSync(join("package.json"))) {
  die("Please run script from project root!");
}

// run main, handle exit code
main()
  .then(res => {
    if (res === true) process.exit(0);
    if (typeof res === "number") process.exit(res);
    if (!res) process.exit(1);
    log(res);
    process.exit(1);
  })
  .catch(err => die(err));
