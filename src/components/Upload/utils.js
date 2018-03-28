// @flow

import { log } from 'utils';

export async function uploadFile(file: File) {
  const body = new FormData();
  body.append('file', file);
  const response = await fetch('http://192.168.99.100:8010/images', {
    method: 'POST',
    body,
  });
  if (!response.ok) {
    response.json().then(error => log.error(error));
    throw new Error('There is a problem with uploading the photo');
  }
  const result = await response.json();
  return result;
}
