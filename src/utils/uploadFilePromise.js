// @flow strict

import Cookies from 'universal-cookie';
import { pathOr } from 'ramda';

const uploadFilePromise = (file: File): Promise<string> => {
  const cookies = new Cookies();
  const jwt = pathOr(null, ['value'], cookies.get('__jwt'));

  if (!process.env.REACT_APP_STATIC_IMAGES_ENDPOINT || !jwt) {
    return Promise.reject(
      new Error('No REACT_APP_STATIC_IMAGES_ENDPOINT or jwt presented'),
    );
  }

  const body = new FormData();
  body.append('file', file);

  const endpoint = process.env.REACT_APP_STATIC_IMAGES_ENDPOINT || '';
  return fetch(endpoint, {
    method: 'POST',
    body,
    headers: {
      Authorization: `Bearer ${String(jwt)}`,
    },
  })
    .then(resp => resp.json())
    .then(json => {
      if (json && json.url) {
        return Promise.resolve(json.url);
      }
      return Promise.reject(new Error(json));
    });
};

export default uploadFilePromise;
