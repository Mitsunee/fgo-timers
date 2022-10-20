import { ClassName } from "@atlasacademy/api-connector";

export function nameServantClass(className: ClassName): string {
  if (className == ClassName.ALTER_EGO) {
    return "Alter Ego";
  }

  if (className == ClassName.MOON_CANCER) {
    return "Moon Cancer";
  }

  return className.replace(/^\w/, c => c.toUpperCase());
}
