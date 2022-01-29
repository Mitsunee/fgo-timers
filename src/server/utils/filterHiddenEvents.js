/* filterHiddenEvents
 * Filters Array of Events to that have ended hide if set as such
 */

import { getCurrentTime } from "./getCurrentTime";
import { createServerError } from "./createServerError";

export function filterHiddenEvents(events) {
  // TODO: strip hide property

  const filteredEvents = new Array();
  const currentTime = getCurrentTime();

  for (const event of events) {
    if (event.hide && typeof event.hide !== "number") {
      throw createServerError(`Expected event.hide to be type number`);
    }

    // skip if hidden time is set and already passed
    if (event.hide && event.hide < currentTime) continue;

    filteredEvents.push(event);
  }

  return filteredEvents;
}
