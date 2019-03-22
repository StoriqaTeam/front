// @flow strict

import Cookies from 'universal-cookie';
import { pathOr, forEach, isEmpty, length } from 'ramda';

import { log, jwt as JWT } from 'utils';

const uploadMultipleFiles = (
  files: FileList,
): Promise<Array<{ url: string, error?: string }>> => {
  if (!files || isEmpty(files)) {
    return Promise.reject(new Error('Please, select files'));
  }
  log.info(files);

  // length
  // $FlowIgnore
  if (length(files) > 10) {
    return Promise.reject(new Error('Maximum number of images: 10'));
  }

  // 20MB
  forEach(file => {
    log.info(file);
    if (file.size > 20 * 1024 * 1024) {
      return Promise.reject(new Error('Maximum file size is 20MB'));
    }
    return true;
    // $FlowIgnore
  }, files);

  // type
  forEach(file => {
    log.info(file);
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      return Promise.reject(new Error('Only JPEG/PNG allowed'));
    }
    return true;
    // $FlowIgnore
  }, files);

  const cookies = new Cookies();
  const jwt = pathOr(null, ['value'], cookies.get(JWT.jwtCookieName));
  const body = new FormData();

  forEach(file => {
    body.append('file', file);
    // $FlowIgnore
  }, files);

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

export default uploadMultipleFiles;
