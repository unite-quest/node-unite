function toHours(durationMs: number): number {
  if (!durationMs) {
    return 0;
  }

  return durationMs / (1000 * 60 * 60);
}
export default toHours;
