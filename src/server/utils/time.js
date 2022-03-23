import spacetime from "spacetime";

function truncTime(ts) {
  return Math.trunc(ts / 1000);
}

export function getCurrentTime() {
  return truncTime(Date.now());
}

export function tsToSpacetime(ts, tz) {
  if (tz) return spacetime(ts * 1000, tz);
  return spacetime(ts * 1000);
}

export function spacetimeToTs(s) {
  return truncTime(s.epoch);
}
