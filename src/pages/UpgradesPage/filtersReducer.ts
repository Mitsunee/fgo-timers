import ClassName from "@atlasacademy/api-connector/dist/Enum/ClassName.js";
import type { SupportedRegion } from "src/atlas-api/api";
import { UpgradeQuestType } from "src/upgrades/types";

export type SelectableClassId =
  | ClassName.SABER
  | ClassName.ARCHER
  | ClassName.LANCER
  | ClassName.RIDER
  | ClassName.CASTER
  | ClassName.ASSASSIN
  | ClassName.BERSERKER
  | ClassName.EXTRA;

export const selectableClasses: SelectableClassId[] = [
  ClassName.SABER,
  ClassName.ARCHER,
  ClassName.LANCER,
  ClassName.RIDER,
  ClassName.CASTER,
  ClassName.ASSASSIN,
  ClassName.BERSERKER,
  ClassName.EXTRA
];

export interface FormFilterState {
  region: null | SupportedRegion;
  target: null | "skill" | "np" | "sq";
  type: null | UpgradeQuestType.INTERLUDE | UpgradeQuestType.RANKUP;
  classId: Record<SelectableClassId, boolean>;
}

export const formFiltersDefault: FormFilterState = {
  region: "JP",
  target: null,
  type: null,
  classId: Object.fromEntries(
    Array.from(selectableClasses, id => [id, false])
  ) as FormFilterState["classId"]
};

export type FormFilterAction =
  | { type: "region"; value: FormFilterState["region"] }
  | { type: "target"; value: FormFilterState["target"] }
  | { type: "type"; value: FormFilterState["type"] }
  | { type: "classId"; value: SelectableClassId };

export function filtersReducer(
  state: FormFilterState,
  action: FormFilterAction
): FormFilterState {
  // skip useless rerender
  if (state[action.type] == action.value) return state;

  // deepClone state
  const newState: FormFilterState = { ...state, classId: { ...state.classId } };
  switch (action.type) {
    case "region":
      newState.region = action.value;
      break;
    case "target":
      newState.target = action.value;
      // if new target is "sq" and current type is RANKUP reset type
      if (action.value == "sq" && newState.type == UpgradeQuestType.RANKUP) {
        newState.type = null;
      }
      break;
    case "type":
      newState.type = action.value;
      // if new type is RANKUP and current target is sq reset target
      if (action.value == UpgradeQuestType.RANKUP && newState.target == "sq") {
        newState.target = null;
      }
      break;
    case "classId":
      // boolean toggle selected class
      newState.classId[action.value] = !newState.classId[action.value];
      break;
    default:
      // return old state for unknown action to prevent rerender
      return state;
  }
  return newState;
}
