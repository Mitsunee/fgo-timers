import { baseClasses } from "@utils/classNames";

/**
 * !DEPRECATED!
 */
export function matchClassName(needle, haystack) {
  let check = "extra";
  if (baseClasses.has(needle)) {
    check = needle;
  }

  if (haystack instanceof Set) {
    return haystack.has(check);
  }

  return haystack.includes(check);
}
