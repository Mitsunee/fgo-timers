import { z } from "zod";

export const enum UpgradeQuestType {
  INTERLUDE = "intld",
  RANKUP = "rankup",
  OTHER = "other"
}

export interface QuestUnlockCondition {
  quests?: number[];
  bond?: number;
  asc?: number;
}

interface QuestBase {
  name: string;
  open?: number; // opening date as timestamp
  type: UpgradeQuestType;
  na?: true;
  unlock?: QuestUnlockCondition;
}

export interface QuestOther extends QuestBase {
  type: UpgradeQuestType.OTHER;
  open?: undefined;
  unlock?: undefined;
}

export interface QuestUpgrade extends QuestBase {
  type: UpgradeQuestType.INTERLUDE | UpgradeQuestType.RANKUP;
  open: number;
}

export type BundledQuest = QuestOther | QuestUpgrade;

export type UpgradeMapSkill = { type: "skill"; id?: number; newId: number };
export type UpgradeMapNP = { type: "np"; id: number; newId: number };
export type UpgradeMap = UpgradeMapSkill | UpgradeMapNP;

interface UpgradeBase {
  quest: number; // quest id
  servant: number; // servant id
  upgrades?: UpgradeMap;
  na?: true;
}

// need to split this into two types to make typeguards work properly
export type Upgrade = UpgradeBase &
  (
    | { upgrades: UpgradeMapSkill }
    | { upgrades: UpgradeMapNP }
    | { upgrades?: undefined }
  );

export function upgradeIsSkillUpgrade(
  upgrade: Upgrade
): upgrade is UpgradeBase & { upgrades: UpgradeMapSkill } {
  return upgrade.upgrades?.type == "skill";
}

export function upgradeIsNPUpgrade(
  upgrade: Upgrade
): upgrade is UpgradeBase & { upgrades: UpgradeMapNP } {
  return upgrade.upgrades?.type == "np";
}

const _zOverrideKey = z
  .string()
  .regex(
    /^[A-Z]([A-Z_]*[A-Z])?$/,
    "openTimeOverrides constants may only use uppercase letters and underscores and must start with a letter."
  );
const _zQuestId = z.number().min(1498449600);

export const OpenTimeOverridesSchema = z.object({
  constants: z.record(_zOverrideKey, _zQuestId, z.undefined()),
  overrides: z.record(
    z
      .string()
      .regex(/^\d+$/)
      .transform(val => +val),
    z.union([_zQuestId, _zOverrideKey, z.undefined()])
  )
});

export type OpenTimeOverrides = z.infer<typeof OpenTimeOverridesSchema>;
