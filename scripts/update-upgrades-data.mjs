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
const LAUNCH_GAME = 1498460400;
const missingDatesMap = new Map([
  [91100101, LAUNCH_GAME], // Altria Pendragon Interlude 1
  [91100102, LAUNCH_GAME], // Altria Pendragon Interlude 2
  [91100201, LAUNCH_GAME], // Altria Pendragon (Alter) Interlude 1
  [91100202, LAUNCH_GAME], // Altria Pendragon (Alter) Interlude 2
  [91100301, LAUNCH_GAME], // Altria Pendragon (Lily) Interlude 1
  [91100501, LAUNCH_GAME], // Nero Claudius Interlude 1
  [91100502, LAUNCH_GAME], // Nero Claudius Interlude 2
  [91100503, LAUNCH_GAME], // Nero Claudius Interlude 3
  // Nero Claudius (Bride) - SQ - 91100601: Bouquet of Meetings
  // Nero Claudius (Bride) - NP - 91100602: The Bouquet of Resolve
  [91100801, LAUNCH_GAME], // Siegfried Interlude 1
  [91100802, LAUNCH_GAME], // Siegfried Interlude 2
  // Mordred - NP - 91100901: King of Kings
  [91101301, LAUNCH_GAME], // Gaius Julius Caesar Interlude 1
  // Fergus mac Róich - NP - 91101401: Pretty Illusion
  [91101801, LAUNCH_GAME], // Altera Interlude 1
  [91101802, LAUNCH_GAME], // Altera Interlude 2
  // Altera - S2 - 91101803: My Sword of the God of War
  [91102201, LAUNCH_GAME], // Gilles de Rais Interlude 1
  [91102601, LAUNCH_GAME], // Chevalier d'Eon Interlude 1
  [91200101, LAUNCH_GAME], // Emiya Interlude 1
  [91200102, LAUNCH_GAME], // Emiya Interlude 2
  [91200201, LAUNCH_GAME], // Gilgamesh Interlude 1
  // Gilgamesh - NP - 91200202: Law of Creation
  // Gilgamesh - S3 - 91200203: Law of Heaven
  [91200301, LAUNCH_GAME], // Robin Hood Interlude 1
  // Atalante - S1 - 91200501: Smile of the Goddess
  // Atalante - NP - 91200502: London Child
  // Orion - SQ - 91200901: Unsweet Honeymoon
  // Orion - NP - 91200902: A Certain Love Song
  // Orion - SQ - 91200903: Golden Anniversary!
  // Nikola Tesla - NP - 91201101: Lightning
  [91201201, LAUNCH_GAME], // Euryale Interlude 1
  // Arash - NP - 91201301: Lonely Soldier, Brave As a Lion
  // Arjuna - NP - 91201501: True Value of the Divine Bow
  // Gilgamesh (Child) - NP - 91201801: How to Love a Wild Flower
  [91300101, LAUNCH_GAME], // Cú Chulainn Interlude 1
  // Diarmuid Ua Duibhne - NP - 91300201: Twin-Spear of the Rose
  // Karna - SQ - 91300401: Heroic Spirit of the Charity
  [91300501, LAUNCH_GAME], // Elisabeth Báthory Interlude 1
  [91300601, LAUNCH_GAME], // Musashibou Benkei Interlude 1
  [91300701, LAUNCH_GAME], // Cú Chulainn (Prototype) Interlude 1
  [91300901, LAUNCH_GAME], // Leonidas I Interlude 1
  [91301001, LAUNCH_GAME], // Romulus Interlude 1
  // Fionn mac Cumhaill - NP - 91301101: Fionn mac Cumhaill, The Hero who Defeated the Gods
  // Brynhild - NP - 91301201: Yet I Want to Remain a Flame
  // Scáthach - NP - 91301301: Kill Me If You Can
  // Hektor - NP - 91301601: Trojan Guardian
  // Altria Pendragon (Alter) - NP - 91301901: Unwakeable Dream, Unending War
  // Altria Pendragon (Lancer) - SQ - 91302001: Sacred Lance King of Knights
  [91400101, LAUNCH_GAME], // Medusa Interlude 1
  // Francis Drake - NP - 91400301: Treasure Island
  [91400601, LAUNCH_GAME], // Georgios Interlude 1
  // Edward Teach - SQ - 91400801: A Man's Battle
  // Anne Bonny & Mary Read - NP - 91400901: Capture Captain Kidd's Treasure
  // Anne Bonny & Mary Read - SQ - 91400902: Treasure of the Knights Templar!
  [91401101, LAUNCH_GAME], // Boudica Interlude 1
  // Queen Medb - S2 - 91401301: Queen's Discipline
  [91401401, LAUNCH_GAME], // Ushiwakamaru Interlude 1
  // Alexander - NP - 91401501: The Beginning of a Trampling Conquest
  [91401701, LAUNCH_GAME], // Marie Antoinette Interlude 1
  [91401702, LAUNCH_GAME], // Marie Antoinette Interlude 2
  [91401901, LAUNCH_GAME], // Martha Interlude 1
  [91401902, LAUNCH_GAME], // Martha Interlude 2
  // Medea - NP - 91500101: Witch's Backyard
  [91500201, LAUNCH_GAME], // Gilles de Rais (Caster) Interlude 1
  // Tamamo-no-Mae - NP - 91500301: E-Pal Wars
  // Tamamo-no-Mae - S3 - 91500302: Nine-tailed Fox
  // Nursery Rhyme - NP - 91500401: A Bunch of Books, a Crowd of Us
  // Hans Christian Andersen - NP - 91500501: Human Observation
  [91500701, LAUNCH_GAME], // William Shakespeare Interlude 1
  // Leonardo da Vinci - SQ - 91500901: Not Even The Almighty Hand Can Reach Here
  // Paracelsus von Hohenheim - NP - 91501001: Devil's Quest
  // Charles Babbage - NP - 91501101: Iron Mobile Report C. Babbage
  // Nitocris - NP - 91501201: Pharaoh Nitocris
  // Mephistopheles - NP - 91501401: Tick Tock, Bang!
  [91501501, LAUNCH_GAME], // Wolfgang Amadeus Mozart Interlude 1
  // Medea (Lily) - NP - 91501701: Close Friend of a Witch
  // Medea (Lily) - S2 - 91501702: Pancakes of Happiness
  [91501901, LAUNCH_GAME][ // Waver Interlude 1
    // Zhuge Liang (Lord El-Melloi II) - SQ - 91501902: Endless Sea
    // Zhuge Liang (Lord El-Melloi II) - NP - 91501903: Truth of the Ascension
    (91502101, LAUNCH_GAME)
  ], // Cú Chulainn (Caster) Interlude 1
  // Helena Blavatsky - NP - 91502301: The World that She Sees
  // Thomas Edison - S3 - 91502501: Can I Do It?
  [91600101, LAUNCH_GAME], // Sasaki Kojirou Interlude 1
  [91600201, LAUNCH_GAME], // Hassan of the Cursed Arm Interlude 1
  // Jack the Ripper - NP - 91600501: Jack Kills Jack
  [91601001, LAUNCH_GAME], // Stheno Interlude 1
  [91601002, LAUNCH_GAME], // Stheno Interlude 2
  [91601101, LAUNCH_GAME], // Jing Ke Interlude 1
  [91601201, LAUNCH_GAME], // Charles-Henri Sanson Interlude 1
  [91601301, LAUNCH_GAME], // Phantom of the Opera Interlude 1
  [91601401, LAUNCH_GAME], // Mata Hari Interlude 1
  [91601701, LAUNCH_GAME], // Carmilla Interlude 1
  // Mysterious Heroine X - SQ - 91601801: Saber Slayer, Chapter Dawn
  // Mysterious Heroine X - SQ - 91601802: Saber Slayer, Chapter Battle
  // Mysterious Heroine X - NP - 91601803: Saber Slayer, Chapter Awaken
  // Shuten-Douji - SQ - 91602101: Drunkenness, Madness, and Rage
  [91700101, LAUNCH_GAME], // Heracles Interlude 1
  [91700102, LAUNCH_GAME], // Heracles Interlude 2
  [91700201, LAUNCH_GAME], // Lancelot Interlude 1
  [91700202, LAUNCH_GAME], // Lancelot Interlude 2
  [91700301, LAUNCH_GAME], // Lu Bu Fengxian Interlude 1
  // Frankenstein - NP - 91700401: The Events of a Lonely Night in November I
  // Frankenstein - S2 - 91700402: The Events of a Lonely Night in November II
  [91700501, LAUNCH_GAME], // Spartacus Interlude 1
  // Sakata Kintoki - SQ - 91700601: Kintoki's Bear Extermination on Mt. Ashigara
  // Vlad III - NP - 91700701: Legend of Dracula I
  // Vlad III - S2 - 91700702: Legend of Dracula II
  // Beowulf - NP - 91700801: Grendel's Second Coming
  // Asterios - NP - 91700901: This Hand, For You
  [91701001, LAUNCH_GAME], // Caligula Interlude 1
  [91701101, LAUNCH_GAME], // Darius III Interlude 1
  [91701102, LAUNCH_GAME], // Darius III Interlude 2
  [91701301, LAUNCH_GAME], // Kiyohime Interlude 1
  [91701501, LAUNCH_GAME], // Eric Bloodaxe Interlude 1
  [91701601, LAUNCH_GAME], // Tamamo Cat Interlude 1
  // Tamamo Cat - NP - 91701602: The Ring of Carnage
  // Ibaraki-Douji - SQ - 91702201: Fire and Alcohol and Oni! Oh, My!
  [91900101, LAUNCH_GAME], // Jeanne d'Arc Interlude 1
  // Jeanne d'Arc - NP - 91900102: My God is with Me II
  // Edmond Dantès - SQ - 911100201: Nightmare; or, the Call of Love and Hate
  [] // PLACEHOLDER: prettier keeps yeeting my comma
]);

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
  open:
    missingDatesMap.get(questData.id) ||
    questDataNA?.openedAt ||
    questData.openedAt,
  type: questData.type === "friendship" ? "interlude" : "rankup",
  unlock: {
    bond:
      questData.releaseConditions?.find(({ type }) => type === "svtFriendship")
        ?.value ?? 0,
    ascension:
      questData.releaseConditions?.find(({ type }) => type === "svtLimit")
        ?.value ?? 0,
    quest:
      // TODO: fetch this data?
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
