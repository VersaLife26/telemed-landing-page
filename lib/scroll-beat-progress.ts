/** When to swap to the next beat within a scroll segment (0–1). */
export const BEAT_SWAP = 0.38;

export function beatDisplayIndex(progress: number, beatCount: number) {
  const scaled = progress * beatCount;
  const index = Math.min(beatCount - 1, Math.max(0, Math.floor(Math.min(scaled, beatCount - 0.001))));
  const blend = scaled - index;
  return blend >= BEAT_SWAP && index < beatCount - 1 ? index + 1 : index;
}
