import { z } from "zod";

export enum UpgradeQuestType {
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
  // kinda want a better name for this, but couldn't come up with one
  type: UpgradeQuestType.INTERLUDE | UpgradeQuestType.RANKUP;
  open: number;
}

export type BundledQuest = QuestOther | QuestUpgrade;

export type UpgradeMap =
  | { type: "skill"; id?: number; newId: number }
  | { type: "np"; id: number; newId: number };

export interface Upgrade {
  quest: number; // quest id
  servant: number; // servant id
  upgrades?: UpgradeMap;
  na?: true;
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
