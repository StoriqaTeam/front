// 2018-06-28T09:55:53.978259

import {
    stringFromTimestamp,
    timeFromTimestamp,
    shortDateFromTimestamp,
    fullDateFromTimestamp,
 } from 'utils/formatDate';

const timestamp = '2018-06-28T09:55:53.978259';

describe('Dates formatter', () => {
  it('should convert timestamp to default format if no format', () => {
    expect(stringFromTimestamp({timestamp:  timestamp})).toEqual('28-06-2018 09:55');
  })

  it('should convert timestamp to presented format', () => {
    expect(stringFromTimestamp({timestamp:  timestamp, format: 'DD-MM-YYYY'})).toEqual('28-06-2018');
  })

  it('should correct extract time from timestamp', () => {
    expect(timeFromTimestamp(timestamp)).toEqual('09:55');
  })

  it('should correct format to short date from timestamp', () => {
    expect(shortDateFromTimestamp(timestamp)).toEqual('28 Jun 2018');
  })

  it('should correct format to full date from timestamp', () => {
    expect(fullDateFromTimestamp(timestamp)).toEqual('28 June 2018');
  })
})