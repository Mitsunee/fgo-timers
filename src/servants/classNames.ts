import ClassName from "@atlasacademy/api-connector/dist/Enum/ClassName.js";

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

export function getClassIconPath(
  className: ClassName,
  rarity: number = 5
): string {
  let rarityStr = "_g";
  switch (rarity) {
    case 0:
      if (className == ClassName.AVENGER) rarityStr = "_0";
      break;
    case 1:
    case 2:
      rarityStr = "_b";
      break;
    case 3:
      rarityStr = "_s";
      break;
  }

  switch (className) {
    case ClassName.ALTER_EGO:
      return `${basePath}/alterEgo${rarityStr}.png`;
    case ClassName.ARCHER:
      return `${basePath}/archer${rarityStr}.png`;
    case ClassName.ASSASSIN:
      return `${basePath}/assassin${rarityStr}.png`;
    case ClassName.AVENGER:
      return `${basePath}/avenger${rarityStr}.png`;
    case ClassName.BERSERKER:
      return `${basePath}/berserker${rarityStr}.png`;
    case ClassName.CASTER:
      return `${basePath}/caster${rarityStr}.png`;
    case ClassName.FOREIGNER:
      return `${basePath}/foreigner${rarityStr}.png`;
    case ClassName.LANCER:
      return `${basePath}/lancer${rarityStr}.png`;
    case ClassName.MOON_CANCER:
      return `${basePath}/mooncancer${rarityStr}.png`;
    case ClassName.PRETENDER:
      return `${basePath}/pretender${rarityStr}.png`;
    case ClassName.RIDER:
      return `${basePath}/rider${rarityStr}.png`;
    case ClassName.RULER:
      return `${basePath}/ruler${rarityStr}.png`;
    case ClassName.SABER:
      return `${basePath}/saber${rarityStr}.png`;
    case ClassName.SHIELDER:
      return `${basePath}/shielder${rarityStr}.png`;
    case ClassName.EXTRA:
      return `${basePath}/extra.png`;
    default:
      return `${basePath}/question${rarityStr}.png`;
  }
}

export function classIsExtra(classId: ClassName): boolean {
  switch (classId) {
    case ClassName.SABER:
    case ClassName.ARCHER:
    case ClassName.LANCER:
    case ClassName.RIDER:
    case ClassName.CASTER:
    case ClassName.ASSASSIN:
    case ClassName.BERSERKER:
      return false;
    default:
      return true;
  }
}
