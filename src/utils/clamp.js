export function clamp({ value, min, max }) {
  let out = value;
  if (min && value < min) out = min;
  if (max && value > max) out = max;

  return out;
}

export function isClamped({ value, min, max }) {
  if (min && value < min) return false;
  if (max && value > max) return false;
  return true;
}
