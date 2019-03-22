// @flow strict

import Cookies from 'universal-cookie';
import { pathOr } from 'ramda';

import { log, jwt as JWT } from 'utils';

const uploadFile = (file: ?File): Promise<{ url: string, error?: string }> => {
  if (!file) {
    return Promise.reject(new Error('Please, select file'));
  }
  log.info(file);

  // 20MB
  if (file.size > 20 * 1024 * 1024) {
    return Promise.reject(new Error('Maximum file size is 20MB'));
  }

  if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
    return Promise.reject(new Error('Only JPEG/PNG allowed'));
  }

  const cookies = new Cookies();
  const jwt = pathOr(null, ['value'], cookies.get(JWT.jwtCookieName));
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
      // muted because it used only for logging
      /* eslint-disable promise/no-nesting */
      response
        .json()
        .then(log.error)
        .catch(log.error);
      return Promise.reject(
        new Error('There is a problem with uploading the photo'),
      );
      /* eslint-enable promise/no-nesting */
    }

    return response.json();
  });
};

export default uploadFile;
