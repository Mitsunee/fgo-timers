import { capitalize } from "@utils/capitalize";

export function toTitleCase(str) {
  return capitalize(str.replace(/\w\S*/g, word => capitalize(word)));
}
