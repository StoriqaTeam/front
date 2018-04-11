// @flow

import { log } from 'utils';

export async function uploadFile(file: File) {
  const body = new FormData();
  body.append('file', file);
  if (!process.env.REACT_APP_STATIC_IMAGES_ENDPOINT) return null;
  const response = await fetch(process.env.REACT_APP_STATIC_IMAGES_ENDPOINT, {
    method: 'POST',
    body,
    headers: {
      Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyfQ.g5ZM3g7XKc8ioRY01eWMpEOSHSN5TgGQP2acUP7MYh8', // TODO: pass jwt from cookies
    },
  });
  if (!response.ok) {
    response.json().then(error => log.error(error));
    throw new Error('There is a problem with uploading the photo');
  }
  const result = await response.json();
  return result;
}
