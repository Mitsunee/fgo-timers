export function filterHiddenEvents(events, now) {
  return events.filter(event => {
    if (!event.hide) return true;
    return event.hide >= now;
  });
}
