// @flow strict

export default (): string =>
  Math.random()
    .toString(36)
    .substring(7);
