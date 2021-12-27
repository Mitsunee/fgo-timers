interface RequiredQuest {
  name: string; // name of the quest
  id: number; // id the of quest
  na?: true; // set to the if quest is available on NA
}

interface UnlockObject {
  // Condition that are required to be fullfilled to be able to do the quest
  // connected to the upgrade
  quest?: RequiredQuest[];
  ascension?: number;
  bond?: number;
}

type QuestType = "interlude" | "rankup";

interface Quest {
  // this object contains all information on the quest connected to the upgrade
  id: number; // quest id
  name: string; // Name of the quest
  search: string; // Name of the quest after latinize()
  open: number; // timestamp of quest release date
  type: QuestType;
  unlock: UnlockObject;
  na?: true; // set to true if quest is available on NA
}

interface MainQuestQuest {
  id: number;
  open: number;
}

type ClassName =
  | "saber"
  | "archer"
  | "lancer"
  | "rider"
  | "caster"
  | "assassin"
  | "berserker"
  | "ruler"
  | "alterEgo"
  | "avenger"
  | "foreigner"
  | "pretender";

interface Servant {
  // contains display information for the affected servant
  id: number; // servant id
  name: string; // Name of the servant
  search: string; // Name of the servant after latinize
  icon: string; // Full URL of the servant's icon
  className: ClassName;
  na?: true; // set to true if servant is available on NA
}

type BorderColor = "black" | "gold" | "red";

interface Skill {
  // contains display information for the affected skill
  name: string; // name of the skill
  num: 1 | 2 | 3; // which skill of the servant
  icon: string; // Full URL of the skill's icon
  border: BorderColor;
  na?: true; // set to true if skill is available on NA
}

type NPType = "buster" | "arts" | "quick";

interface NP {
  // contains display information for the affected NP
  name: string; // name of the NP
  type: NPType; // card type of the NP
  border: BorderColor; // color corresponding to the upgrade level of the NP
  na?: true; // set to true if NP is available on NA
}

interface MainQuest {
  // this type is used for main quests to keep them in the data to prevent its
  // data being refetched everytime the data update script is ran
  quest: MainQuestQuest;
}

interface SQInterlude {
  target: "sq";
  quest: Quest;
  servant: Servant;
}

interface SkillUpgrade {
  target: "skill";
  initial: Skill; // before this upgrade
  skill: Skill; // after this upgrade
  quest: Quest;
  servant: Servant;
}

interface NPUpgrade {
  target: "np";
  initial: NP; // before this upgrade
  np: NP; // after this upgrade
  quest: Quest;
  servant: Servant;
}

type Upgrades = Array<MainQuest | SQInterlude | SkillUpgrade | NPUpgrade>;

export default Upgrades;
