// @flow strict

import { prop, path, ifElse, compose } from 'ramda';

import type { OnMouseMoveEventType } from '../types';

export const grabImage = ({ currentTarget }: OnMouseMoveEventType): string => {
  const isImage = elm => elm instanceof Image;
  const applyUrl = src => `url(${src})`;
  return ifElse(
    isImage,
    compose(applyUrl, prop('src')),
    path(['style', 'backgroundImage']),
  )(currentTarget);
};
