import { isAbsolute } from "path";

function isInProject(file) {
  return isAbsolute(file) ? file.startsWith(process.cwd()) : true;
}

export function isTicketFile(file) {
  if (!isInProject(file)) return false;
  return /assets\/data\/login-tickets\/\d+\.yml$/.test(file);
}

export function isShopFile(file) {
  if (!isInProject(file)) return false;
  return /assets\/data\/(mana|rare)PrismShop\.yml$/.test(file);
}

export function isDataFile(file) {
  if (!isInProject(file)) return false;
  if (isTicketFile(file) || isShopFile(file)) return true;
  return false;
}

export function getDataFileType(file) {
  if (isTicketFile(file)) return "ticketFile";
  if (isShopFile(file)) return "shopFile";
  return false;
}
