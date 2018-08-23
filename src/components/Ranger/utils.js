// @flow

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

export function clamp(value: number, min: number, max: number): number {
  const result = Math.min(Math.max(value, min), max);
  return parseFloat(result.toFixed(7));
}
