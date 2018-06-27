// @flow

import moment from 'moment';

const stringFromTimestamp = (input: {
  timestamp: number,
  format: ?string,
}): ?string => {
  // date object from timestamp
  const dateObj = moment(input.timestamp).utc();
  return dateObj.format(input.format || 'DD-MM-YYYY HH:mm');
};

// return `17:44`
const timeFromTimestamp = (timestamp: number) =>
  stringFromTimestamp({ timestamp, format: 'HH:mm' });

// return `18 Jan 1970`
const shortDateFromTimestamp = (timestamp: number) =>
  stringFromTimestamp({ timestamp, format: 'DD MMM YYYY' });

// return `18 January 1970`
const fullDateFromTimestamp = (timestamp: number) =>
  stringFromTimestamp({ timestamp, format: 'DD MMMM YYYY' });

export default {
  stringFromTimestamp,
  timeFromTimestamp,
  shortDateFromTimestamp,
  fullDateFromTimestamp,
};
