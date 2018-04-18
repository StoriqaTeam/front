// @flow

import { log } from 'utils';
import Cookies from 'universal-cookie';
import { pathOr } from 'ramda';

export async function uploadFile(file: File) {
  const cookies = new Cookies();
  const jwt = pathOr(null, ['value'], cookies.get('__jwt'));
  const body = new FormData();
  body.append('file', file);
  if (!process.env.REACT_APP_STATIC_IMAGES_ENDPOINT || !jwt) return null;
  const response = await fetch(process.env.REACT_APP_STATIC_IMAGES_ENDPOINT, {
    method: 'POST',
    body,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  if (!response.ok) {
    response.json().then(error => log.error(error));
    throw new Error('There is a problem with uploading the photo');
  }
  const result = await response.json();
  return result;
}
