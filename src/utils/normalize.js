// Maps a value from [min, max] to [-1, 1].
// Values outside the range are clamped — ribbon stays in visible space.
export function normalize(value, min, max) {
  const clamped = Math.max(min, Math.min(max, value))
  return ((clamped - min) / (max - min)) * 2 - 1
}