export function isParsableToInt(value: string): boolean {
  return /^-?\d+$/.test(value);
}
