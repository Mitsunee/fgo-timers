import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import picocolors from "picocolors";
import fetch from "node-fetch";
import { sanitize } from "modern-diacritics";

// BUG: nanospinner currently causes a memory leak after the 10th spinner
// import { createSpinner } from "nanospinner";

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
const LAUNCH_GAME = 1498449600;
const LAUNCH_OKEANOS = 1506582000;
const LAUNCH_LONDON = 1513670400;
const LAUNCH_AMERICA = 1521097200;
const LAUNCH_CAMELOT = 1530178200;
const questDatesMap = new Map([
  /*
   * These quests all have Jan 1, 2000 as their open date in the game data
   */
  [91100101, LAUNCH_GAME], // Altria Pendragon Interlude 1
  [91100102, LAUNCH_GAME], // Altria Pendragon Interlude 2
  [91100201, LAUNCH_GAME], // Altria Pendragon (Alter) Interlude 1
  [91100202, LAUNCH_GAME], // Altria Pendragon (Alter) Interlude 2
  [91100301, LAUNCH_GAME], // Altria Pendragon (Lily) Interlude 1
  [91100501, LAUNCH_GAME], // Nero Claudius Interlude 1
  [91100502, LAUNCH_GAME], // Nero Claudius Interlude 2
  [91100503, LAUNCH_GAME], // Nero Claudius Interlude 3
  [91100601, 1516863600], // Nero Claudius (Bride) Interlude 1 (Valentines 2018) // NOTE: might be wrong?
  [91100602, 1554868800], // Nero Claudius (Bride) Interlude 2 (CCC Pre-Release)
  [91100801, LAUNCH_GAME], // Siegfried Interlude 1
  [91100802, LAUNCH_GAME], // Siegfried Interlude 2
  [91100901, LAUNCH_LONDON], // Mordred Interlude 1
  [91101301, LAUNCH_GAME], // Gaius Julius Caesar Interlude 1
  [91101401, LAUNCH_AMERICA], // Fergus mac Róich Interlude 1
  [91101801, LAUNCH_GAME], // Altera Interlude 1
  [91101802, 1516248000], // Altera Interlude 2 (2M DL Campaign)
  [91101803, 1541649600], // Altera Interlude 3 (New Interludes and Round Table Campaign)
  [91102201, LAUNCH_GAME], // Gilles de Rais Interlude 1
  [91102601, LAUNCH_GAME], // Chevalier d'Eon Interlude 1
  [91200101, LAUNCH_GAME], // Emiya Interlude 1
  [91200102, LAUNCH_GAME], // Emiya Interlude 2
  [91200201, LAUNCH_GAME], // Gilgamesh Interlude 1
  [91200202, 1523505600], // Gilgamesh Interlude 2 (Accel/Zero Pre-Campaign)
  [91200203, 1541649600], // Gilgamesh Interlude 3 (New Interludes and Round Table Campaign)
  [91200301, LAUNCH_GAME], // Robin Hood Interlude 1
  [91200501, LAUNCH_OKEANOS], // Atalante Interlude 1
  [91200502, 1516863600], // Atalante Interlude 2 (Valentines 2018)
  [91200901, 1502942400], // Orion Interlude 1 (Moon Goddess Event)
  [91200902, LAUNCH_AMERICA], // Orion Interlude 2
  [91200903, 1547708400], // Orion Interlude 3 (Moon Goddess Rerun)
  [91201101, LAUNCH_LONDON], // Nikola Tesla Interlude 1
  [91201201, LAUNCH_GAME], // Euryale Interlude 1
  [91201301, LAUNCH_CAMELOT], // Arash Interlude 1
  [91201501, 1514444400], // Arjuna Interlude 1 (New Years 2018)
  [91201801, 1541649600], // Gilgamesh (Child) Interlude 1 (New Interludes and Round Table Campaign)
  [91300101, LAUNCH_GAME], // Cú Chulainn Interlude 1
  [91300201, 1519275600], // Diarmuid Ua Duibhne Interlude 1 (Chaldea Boys 2018)
  [91300401, 1514444400], // Karna Interlude 1 (New Years 2018)
  [91300501, LAUNCH_GAME], // Elisabeth Báthory Interlude 1
  [91300601, LAUNCH_GAME], // Musashibou Benkei Interlude 1
  [91300701, LAUNCH_GAME], // Cú Chulainn (Prototype) Interlude 1
  [91300901, LAUNCH_GAME], // Leonidas I Interlude 1
  [91301001, LAUNCH_GAME], // Romulus Interlude 1
  [91301101, LAUNCH_AMERICA], // Fionn mac Cumhaill Interlude 1
  [91301201, 1557979200], // Brynhild Interlude 1 (6M DL Campaign)
  [91301301, 1516863600], // Scáthach Interlude 1 (Valentines 2018)
  [91301601, LAUNCH_OKEANOS], // Hektor Interlude 1
  [91301901, LAUNCH_LONDON], // Altria Pendragon (Lancer Alter) Interlude 1
  [91302001, LAUNCH_CAMELOT], // Altria Pendragon (Lancer) Interlude 1
  [91400101, LAUNCH_GAME], // Medusa Interlude 1
  [91400301, LAUNCH_OKEANOS], // Francis Drake Interlude 1
  [91400601, LAUNCH_GAME], // Georgios Interlude 1
  [91400801, LAUNCH_OKEANOS], // Edward Teach Interlude 1
  [91400901, LAUNCH_OKEANOS], // Anne Bonny & Mary Read Interlude 1
  [91400902, LAUNCH_CAMELOT], // Anne Bonny & Mary Read Interlude 2
  [91401101, LAUNCH_GAME], // Boudica Interlude 1
  [91401301, LAUNCH_AMERICA], // Queen Medb Interlude 1
  [91401401, LAUNCH_GAME], // Ushiwakamaru Interlude 1
  [91401501, LAUNCH_OKEANOS], // Alexander Interlude 1
  [91401701, LAUNCH_GAME], // Marie Antoinette Interlude 1
  [91401702, LAUNCH_GAME], // Marie Antoinette Interlude 2
  [91401901, LAUNCH_GAME], // Martha Interlude 1
  [91401902, LAUNCH_GAME], // Martha Interlude 2
  [91500101, LAUNCH_OKEANOS], // Medea Interlude 1
  [91500201, LAUNCH_GAME], // Gilles de Rais (Caster) Interlude 1
  [91500301, 1508212800], // Tamamo-no-Mae Interlude 1 (Halloween 1)
  [91500302, 1516863600], // Tamamo-no-Mae Interlude 2 (Valentines 2018)
  [91500401, LAUNCH_LONDON], // Nursery Rhyme Interlude 1
  [91500501, LAUNCH_LONDON], // Hans Christian Andersen Interlude 1
  [91500701, LAUNCH_GAME], // William Shakespeare Interlude 1
  [91500901, 1548907200], // Leonardo da Vinci Interlude 1 (5M DL Campaign)
  [91501001, LAUNCH_LONDON], // Paracelsus Interlude 1
  [91501101, LAUNCH_LONDON], // Charles Babbage Interlude 1
  [91501201, 1541649600], // Nitocris Interlude 1 (New Interludes and Round Table Campaign)
  [91501401, LAUNCH_LONDON], // Mephistopheles Interlude 1
  [91501501, LAUNCH_GAME], // Wolfgang Amadeus Mozart Interlude 1
  [91501701, 1519275600], // Medea (Lily) Interlude 1 (Chaldea Boys 2018)
  [91501702, LAUNCH_CAMELOT], // Medea (Lily) Interlude 2
  [91501901, LAUNCH_GAME], // Waver Interlude 1
  [91501902, LAUNCH_OKEANOS], // Waver Interlude 2
  [91501903, LAUNCH_OKEANOS], // Waver Interlude 3
  [91502101, LAUNCH_GAME], // Cú Chulainn (Caster) Interlude 1
  [91502301, 1557979200], // Helena Blavatsky Interlude 1 (6M DL Campaign)
  [91502501, LAUNCH_AMERICA], // Thomas Edison Interlude 1
  [91600101, LAUNCH_GAME], // Sasaki Kojirou Interlude 1
  [91600201, LAUNCH_GAME], // Hassan of the Cursed Arm Interlude 1
  [91600501, LAUNCH_LONDON], // Jack the Ripper Interlude 1
  [91601001, LAUNCH_GAME], // Stheno Interlude 1
  [91601002, LAUNCH_GAME], // Stheno Interlude 2
  [91601101, LAUNCH_GAME], // Jing Ke Interlude 1
  [91601201, LAUNCH_GAME], // Charles-Henri Sanson Interlude 1
  [91601301, LAUNCH_GAME], // Phantom of the Opera Interlude 1
  [91601401, LAUNCH_GAME], // Mata Hari Interlude 1
  [91601701, LAUNCH_GAME], // Carmilla Interlude 1
  [91601801, 1515038400], // Mysterious Heroine X Interlude 1 (Saber Wars)
  [91601802, 1515038400], // Mysterious Heroine X Interlude 2 (Saber Wars)
  [91601803, 1515038400], // Mysterious Heroine X Interlude 3 (Saber Wars)
  [91602101, 1526454000], // Shuten-Douji Interlude 1 (Rashomon)
  [91700101, LAUNCH_GAME], // Heracles Interlude 1
  [91700102, LAUNCH_GAME], // Heracles Interlude 2
  [91700201, LAUNCH_GAME], // Lancelot Interlude 1
  [91700202, LAUNCH_GAME], // Lancelot Interlude 2
  [91700301, LAUNCH_GAME], // Lu Bu Fengxian Interlude 1
  [91700401, LAUNCH_LONDON], // Frankenstein Interlude 1
  [91700402, 1516863600], // Frankenstein Interlude 2 (Valentines 2018)
  [91700501, LAUNCH_GAME], // Spartacus Interlude 1
  [91700601, LAUNCH_LONDON], // Sakata Kintoki Interlude 1
  [91700701, LAUNCH_LONDON], // Vlad III Interlude 1
  [91700702, 1557979200], // Vlad III Interlude 2 (6M DL Campaign)
  [91700801, 1519275600], // Beowulf Interlude 1 (Chaldea Boys 2018)
  [91700901, LAUNCH_OKEANOS], // Asterios Interlude 1
  [91701001, LAUNCH_GAME], // Caligula Interlude 1
  [91701101, LAUNCH_GAME], // Darius III Interlude 1
  [91701102, LAUNCH_GAME], // Darius III Interlude 2
  [91701301, LAUNCH_GAME], // Kiyohime Interlude 1
  [91701501, LAUNCH_GAME], // Eric Bloodaxe Interlude 1
  [91701601, LAUNCH_GAME], // Tamamo Cat Interlude 1
  [91701602, LAUNCH_LONDON], // Tamamo Cat Interlude 2
  [91702201, 1558508400], // Ibaraki-Douji Interlude 1 (Rashomon Rerun)
  [91900101, LAUNCH_GAME], // Jeanne d'Arc Interlude 1
  [91900102, 1557979200], // Jeanne d'Arc Interlude 2 (6M DL Campaign)
  [911100201, 1548313200], // Edmond Dantès Interlude 1 (Prison Tower Rerun)
  /*
   * the following quest have quest.open times after Jan 1, 2000 but still before LAUNCH_GAME
   */
  [91702301, LAUNCH_CAMELOT], // Minamoto-no-Raikou Interlude 1
  [91301302, 1542600000], // Scáthach Interlude 2 (Thanksgiving 2018)
  [91400201, 1542600000], // Iskandar Interlude 1 (Thanksgiving 2018)
  [91400202, 1542600000], // Iskandar Interlude 2 (Thanksgiving 2018)
  [91700602, 1546315200], // Sakata Kintoki Interlude 2 (New Years 2019)
  [91900201, 1543302000], // Amakusa Shirou Interlude 1
  /*
   * these quests literally have JP dates in the NA data
   * smol indie company, please understand
   */
  [91300801, 1584504000], // Enkidu Interlude 1
  [911100101, 1584504000], // Angra Interlude 1
  /*
   * Jekyll here at the end please, as he gets ignored currently lol
   */
  [91600701, LAUNCH_LONDON] // Jekyll & Hyde Interlude 1
]);
const questDataMap = new Map();

// helper functions
const join = relPath => path.join(CWD, relPath);
const log = message => console.log(message);
log.error = message => console.error(picocolors.red(message));
log.warn = message => console.warn(picocolors.yellow(message));
log.success = message => console.log(picocolors.cyan(message));
log.table = arg => {
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
function die(message) {
  if (message) log.error(message);
  process.exit(1);
}
async function fetchData(url, defaultValue, message = "Fetching Data") {
  //const spinner = createSpinner(message);
  log(message); // TEMP
  const _fetch = async (url, defaultValue) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (defaultValue === undefined) {
          //spinner.error(`error while fetching '${url}'`);
          log.error(`Error while fetching '${url}'`); // TEMP
          process.exit(2);
        }
        return defaultValue;
      }
      return await res.json();
    } catch (e) {
      if (defaultValue === undefined) {
        //spinner.error(`received invalid data from '${url}'`);
        log.error(`Received invalid data from '${url}'`);
        process.exit(2);
      }
      return defaultValue;
    }
  };

  let res;
  //spinner.start();
  if (url instanceof Array) {
    res = await Promise.all(
      url.map(async item => await _fetch(item, defaultValue))
    );
  } else {
    res = await _fetch(url, defaultValue);
  }
  //spinner.success();
  return res;
}
async function fetchQuestData(id) {
  let tmp;
  if ((tmp = questDataMap.get(id))) return tmp;

  const [questData, questDataNA] = await fetchData(
    [`${ATLAS}nice/JP/quest/${id}`, `${ATLAS}nice/NA/quest/${id}`],
    false, // needs defaultValue as NA quest may not exist!
    `Fetching quest: ${id}`
  );
  if (!questData) die(`Error while fetching atlas API for quest ${id}`); // but we need JP to exist

  // save to map
  questDataMap.set(id, [questData, questDataNA]);

  // atlas api can't handle too many requests in a row
  await sleep(250);

  return [questData, questDataNA];
}
async function fetchNiceServant() {
  const res = await fetchData(
    [
      `${ATLAS}export/JP/nice_servant_lang_en.json`,
      `${ATLAS}export/NA/nice_servant.json`
    ],
    undefined,
    "Fetching niceServant data"
  );
  return res.map(data =>
    data
      .filter(servant => servant.type === "normal")
      .filter(
        // Jekyll&Hyde (600700) literally turns into an NP as part of his NP, which is not currently supported
        // Melusine (304800) uses strengthStatus 0 on everything and priorities break this script
        ({ id }) => ![600700, 304800].includes(id)
      )
  );
}
function sleep(time = 250) {
  return new Promise(resolve => setTimeout(() => resolve(), time));
}

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
function nameServant(servantData, servantDataNA) {
  const name =
    servantDataNA?.ascensionAdd.overWriteServantName?.ascension?.["0"] || // spoiler-safe name
    servantDataNA?.name || // english name
    servantData?.ascensionAdd.overWriteServantName?.ascension?.["0"] || // spoiler-safe fan-translated name
    servantData.name; // fan-translated name

  return [name, sanitize(name, { lowerCase: true })];
}
function describeServant(servantData, servantDataNA) {
  const [name, search] = nameServant(servantData, servantDataNA);
  return {
    name,
    search,
    icon: servantData.extraAssets.faces.ascension["1"],
    className: servantData.className,
    na: servantDataNA ? true : undefined
  };
}
async function describeQuest(questData, questDataNA) {
  const requiredQuestId =
    questData.releaseConditions?.find(({ type }) => type === "questClear")
      ?.targetId ?? false;
  const [requiredQuest, requiredQuestNA] = requiredQuestId
    ? await fetchQuestData(requiredQuestId)
    : [false, false];

  return {
    id: questData.id,
    name: questDataNA?.name || questData.name,
    open:
      questDatesMap.get(questData.id) ||
      questDataNA?.openedAt ||
      questData.openedAt,
    type: questData.type === "friendship" ? "interlude" : "rankup",
    unlock: {
      bond:
        questData.releaseConditions?.find(
          ({ type }) => type === "svtFriendship"
        )?.value ?? 0,
      ascension:
        questData.releaseConditions?.find(({ type }) => type === "svtLimit")
          ?.value ?? 0,
      quest: requiredQuestNA
        ? { name: requiredQuestNA.name, id: requiredQuestNA.id }
        : requiredQuest
        ? { name: requiredQuest.name, id: requiredQuest.id }
        : undefined
    },
    na: questDataNA ? true : undefined
  };
}

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
  let changedQuests = new Set();
  for (const servant of niceServant) {
    const servantNA = niceServantNA.find(({ id }) => id === servant.id);
    const [servantName] = nameServant(servant, servantNA);

    for (const questId of servant.relateQuestIds) {
      const questCached = data.find(cached => cached.quest.id === questId);
      // new quest
      if (!questCached) {
        log("Quest is new");
        changedQuests.add(questId);
        continue;
      }
      // servant name changed
      if (servantName !== questCached.servant.name) {
        log(
          `Servant Name has changed: '${questCached.servant.name}' => '${servantName}'`
        );
        changedQuests.add(questId);
        continue;
      }
      // quest released on na
      if (
        !questCached.quest.na &&
        servantNA?.relateQuestIds.includes(questId)
      ) {
        log("Quest is new on NA");
        changedQuests.add(questId);
        continue;
      }
    }
  }

  // if nothing changed quit with success
  if (changedQuests.size === 0) {
    log.success(`Data is already up-to-date (total: ${data.length})`);
    return 0;
  }

  const newUpgrades = [];

  for (const quest of changedQuests) {
    // fetch quest data
    const [questData, questDataNA] = await fetchQuestData(quest);

    // handle main quests
    if (questData.type === "main") {
      // this keeps main quest IDs in the data so they aren't fetched everytime
      // the script runs.
      const upgrade = {
        quest: {
          id: quest,
          open: questDataNA?.openedAt || questData.openedAt
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
      log("Quest upgrades a skill");
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
      log.table({
        for: initialSkillNA?.name || initialSkill?.name || "PLACEHOLDER",
        to: relatedSkillNA?.name || relatedSkill.name,
        of: nameServant(relatedServant, relatedServantNA)[0]
      });

      // assemble data
      newUpgrades.push({
        target: "skill",
        initial: describeSkill(
          initialSkill ?? PLACEHOLDER_SKILL,
          initialSkillNA
        ),
        skill: describeSkill(relatedSkill, relatedSkillNA),
        quest: await describeQuest(questData, questDataNA),
        servant: describeServant(relatedServant, relatedServantNA)
      });
      continue;
    }

    // Quest has related NP
    if (relatedNP) {
      log("Quest upgrades NP");
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
      log.table({
        for: initialNPNA?.name || initialNP.name,
        to: relatedNPNA?.name || relatedNP.name,
        of: nameServant(relatedServant, relatedServantNA)[0]
      });

      newUpgrades.push({
        target: "np",
        initial: describeNP(initialNP, initialNPNA),
        np: describeNP(relatedNP, relatedNPNA),
        quest: await describeQuest(questData, questDataNA),
        servant: describeServant(relatedServant, relatedServantNA)
      });
      continue;
    }

    // Quest has neither skill nor NP, assume sq interlude
    log("Quest only rewards Saint Quartz");
    newUpgrades.push({
      target: "sq",
      quest: await describeQuest(questData, questDataNA),
      servant: describeServant(relatedServant, relatedServantNA)
    });
  }

  data = [
    ...data.filter(({ quest }) => !changedQuests.has(quest.id)),
    ...newUpgrades
  ].sort((a, b) => {
    a.quest.open - b.quest.open;
  });

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
