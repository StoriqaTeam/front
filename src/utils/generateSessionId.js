// @flow

const generateSessionId = () => {
  const min = Math.pow(2, 30); // eslint-disable-line
  const max = Math.pow(2, 31); // eslint-disable-line
  const result = parseInt(Math.random() * (max - min) + min, 10);
  return result;
};

export default generateSessionId;
