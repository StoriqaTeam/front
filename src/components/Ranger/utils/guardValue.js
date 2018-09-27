// @flow strict

const guardValue = (guard: number) => (fn: number => number) => (
  value: number,
) => (value ? fn(value) : guard);

export default guardValue;
