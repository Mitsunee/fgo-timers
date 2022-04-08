import { isAbsolute } from "path";

function isInProject(file) {
  return isAbsolute(file) ? file.startsWith(process.cwd()) : true;
}

export function isEventFile(file) {
  if (!isInProject(file)) return false;
  return /assets\/data\/events\/[a-z0-9-]+\.yml$/.test(file);
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
  if (isEventFile(file) || isTicketFile(file) || isShopFile(file)) return true;
  return false;
}

export function getDataFileType(file) {
  if (isEventFile(file)) return "event";
  if (isTicketFile(file)) return "ticketFile";
  if (isShopFile(file)) return "shopFile";
  return false;
}
