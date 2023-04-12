import { isAbsolute } from "path";

function isInProject(file) {
  return isAbsolute(file) ? file.startsWith(process.cwd()) : true;
}

export function isShopFile(file) {
  if (!isInProject(file)) return false;
  return /assets\/data\/(mana|rare)PrismShop\.yml$/.test(file);
}

export function isDataFile(file) {
  if (!isInProject(file)) return false;
  return false;
}

export function getDataFileType(file) {
  if (isShopFile(file)) return "shopFile";
  return false;
}
