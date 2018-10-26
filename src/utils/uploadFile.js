// @flow strict

import Cookies from 'universal-cookie';
import { pathOr } from 'ramda';

import { log } from 'utils';

const uploadFile = (file: File): Promise<{ url?: string, error?: string }> => {
  log.info(file);

  // 20MB
  if (file.size > 20 * 1024 * 1024) {
    return Promise.reject(new Error('Maximum file size is 20MB'));
  }

  if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
    return Promise.reject(new Error('Only JPEG/PNG allowed'));
  }

  const cookies = new Cookies();
  const jwt = pathOr(null, ['value'], cookies.get('__jwt'));
  const body = new FormData();
  body.append('file', file);
  if (!process.env.REACT_APP_STATIC_IMAGES_ENDPOINT || !jwt) {
    return Promise.reject(new Error('Seems that you are not logged in'));
  }

  return fetch(process.env.REACT_APP_STATIC_IMAGES_ENDPOINT, {
    method: 'POST',
    body,
    headers: {
      Authorization: `Bearer ${String(jwt)}`,
    },
  }).then(response => {
    if (!response.ok) {
      response.json().then(log.error);
      return Promise.reject(
        new Error('There is a problem with uploading the photo'),
      );
    }

    return response.json();
  });
};

export default uploadFile;
