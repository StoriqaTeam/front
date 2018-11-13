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

export const calcPosition = (evt: OnMouseMoveEventType): string => {
  const { currentTarget, pageX, pageY } = evt;
  const { left, top, width, height } = currentTarget.getBoundingClientRect();
  const x = (pageX - left) / width * 100;
  const y = (pageY - top) / height * 100;
  return `${x}% ${y}%`;
};
