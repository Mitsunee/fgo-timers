import { matchDate } from "./helpers/matchDate";
import { convertDate } from "./helpers/convertDate";

export function parseDate(dateString, allowDuration) {
  const match = matchDate(dateString, allowDuration);

  if (!allowDuration) return convertDate(match); // only returns one timestamp

  // else attempt to return start and end timestamps
  const [startMatch, endMatch] = match;
  const startDate = convertDate(startMatch);
  const endDate = endMatch ? convertDate(endMatch) : false;

  return [startDate, endDate];
}
