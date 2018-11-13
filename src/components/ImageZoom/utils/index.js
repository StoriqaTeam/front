// @flow strict

import {
  allPass,
  complement,
  compose,
  ifElse,
  isNil,
  map,
  path,
  pick,
  prop,
  propSatisfies,
} from 'ramda';

import type { ZoomEventType } from '../types';

const mapToCoords = fn => map(fn)(['X', 'Y']);

const page = coord => `page${coord}`;

/**
 * @desc gets the pageX/Y properties from MouseEvent or TouchEvent
 */
const getPageCoords = (evt: ZoomEventType) => {
  const coords = ['X', 'Y'];

  const pageProp = coord => propSatisfies(complement(isNil), page(coord));

  const hasPage = allPass(mapToCoords(pageProp));

  const getPage = e => pick(map(page)(coords))(e);

  const getPageTouch = e => {
    const touchItem = path(['changedTouches', '0'])(e);
    return getPage(touchItem);
  };

  return ifElse(hasPage, getPage, getPageTouch)(evt);
};

/**
 * @desc get the image from a <img /> or <div />
 */
export const grabImage = ({ currentTarget }: ZoomEventType): string => {
  const isImage = elm => elm instanceof Image;
  const applyUrl = src => `url(${src})`;
  return ifElse(
    isImage,
    compose(applyUrl, prop('src')),
    path(['style', 'backgroundImage']),
  )(currentTarget);
};

/**
 * @desc calculates the position where the user is 'mouse hovering' or 'touching'
 */
export const calcPosition = (evt: ZoomEventType): string => {
  const { pageX, pageY } = getPageCoords(evt);
  const { currentTarget } = evt;
  const { left, top, width, height } = currentTarget.getBoundingClientRect();
  const x = (pageX - left) / width * 100;
  const y = (pageY - top) / height * 100;
  return `${x}% ${y}%`;
};
