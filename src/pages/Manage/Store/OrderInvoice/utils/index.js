// @flow strict
import { isNil } from 'ramda';


export const formatStatus = (str: string): string =>
  str.replace(/[\W_]+/g, ' ').toLowerCase();

export const setRegion = (admin1: ?string, admin2: ?string): string => {
  let administrativeAreaLevel = '';
  if (!isNil(admin1) && !isNil(admin2)) {
    administrativeAreaLevel = `${admin1}, ${admin2}`;
  }
  if (!isNil(admin1) && isNil(admin2)) {
    administrativeAreaLevel = admin1;
  }
  if (isNil(admin1) && !isNil(admin2)) {
    administrativeAreaLevel = admin2;
  }
  return administrativeAreaLevel;
};
