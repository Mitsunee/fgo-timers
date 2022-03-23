export function sortEvents(events) {
  return events.sort((a, b) => {
    if (a.start === b.start) {
      return a.order - b.order;
    }

    return b.start - a.start;
  });
}
