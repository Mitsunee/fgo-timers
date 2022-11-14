import { ClassName } from "@atlasacademy/api-connector";

export function nameServantClass(className: ClassName): string {
  switch (className) {
    case ClassName.ALTER_EGO:
      return "Alter Ego";
    case ClassName.MOON_CANCER:
      return "Moon Cancer";
    default:
      return className.replace(/^\w/, c => c.toUpperCase());
  }
}

const basePath = "/assets/classes";

export function getClassIconPath(className: ClassName): string {
  switch (className) {
    case ClassName.ALTER_EGO:
      return `${basePath}/alterEgo.png`;
    case ClassName.ARCHER:
      return `${basePath}/archer.png`;
    case ClassName.ASSASSIN:
      return `${basePath}/assassin.png`;
    case ClassName.AVENGER:
      return `${basePath}/avenger.png`;
    case ClassName.BERSERKER:
      return `${basePath}berserker.png`;
    case ClassName.CASTER:
      return `${basePath}caster.png`;
    case ClassName.FOREIGNER:
      return `${basePath}foreigner.png`;
    case ClassName.LANCER:
      return `${basePath}lancer.png`;
    case ClassName.MOON_CANCER:
      return `${basePath}mooncancer.png`;
    case ClassName.PRETENDER:
      return `${basePath}pretender.png`;
    case ClassName.RIDER:
      return `${basePath}rider.png`;
    case ClassName.RULER:
      return `${basePath}ruler.png`;
    case ClassName.SABER:
      return `${basePath}saber.png`;
    case ClassName.SHIELDER:
      return `${basePath}shielder.png`;
    default:
      return `${basePath}extra.png`;
  }
}
