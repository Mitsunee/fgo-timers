import spacetime from "spacetime";

const tzOffset = new Map([
  ["PST", "-08:00"],
  ["PDT", "-07:00"]
]);

export function convertDate({ date, time, timezone }) {
  const s = spacetime(`${date}T${time}:00${tzOffset.get(timezone)}`);

  return s.epoch;
}
