// 1529497331 || 18-01-1970 16:51

import {
    stringFromTimestamp,
    timeFromTimestamp,
    shortDateFromTimestamp,
    fullDateFromTimestamp,
 } from 'utils/formatDate';

describe('Dates formatter', () => {
  it('should convert timestamp to default format if no format', () => {
    expect(stringFromTimestamp({timestamp:  1529497331})).toEqual('18-01-1970 16:51');
  })

  it('should convert timestamp to presented format', () => {
    expect(stringFromTimestamp({timestamp:  1529497331, format: 'DD-MM-YYYY'})).toEqual('18-01-1970');
  })

  it('should correct extract time from timestamp', () => {
    expect(timeFromTimestamp(1529497331)).toEqual('16:51');
  })

  it('should correct format to short date from timestamp', () => {
    expect(shortDateFromTimestamp(1529497331)).toEqual('18 Jan 1970');
  })

  it('should correct format to full date from timestamp', () => {
    expect(fullDateFromTimestamp(1529497331)).toEqual('18 January 1970');
  })
})