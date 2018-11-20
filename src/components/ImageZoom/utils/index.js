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

import { isMobileBrowser } from 'utils';

import type { ZoomEventType, ZoomFnType } from '../types';

const coords = ['X', 'Y'];

const mapToCoords = fn => map(fn)(coords);

const offset = (coord: string): string => `offset${coord}`;
const page = (coord: string): string => `page${coord}`;

/**
 * @desc gets the pageX/Y properties from MouseEvent or TouchEvent
 */
const getPageCoords: ZoomFnType = evt => {
  const offsetProp = (coord: string) =>
    propSatisfies(complement(isNil), offset(coord));

  const hasOffset: ZoomEventType => boolean = allPass(mapToCoords(offsetProp));

  // TODO: apply transducer
  const getOffset: ZoomFnType = e => pick(map(offset)(coords))(e);
  const getPage: ZoomFnType = e => pick(map(page)(coords))(e);

  const getOffsetTouch: ZoomFnType = e =>
    compose(getPage, path(['changedTouches', '0']))(e);

  return ifElse(hasOffset, getOffset, getOffsetTouch)(evt.nativeEvent);
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
  const elm = evt.currentTarget;
  // avoid page scrolling when user touches the screen
  if (isMobileBrowser()) {
    evt.preventDefault();
  }
  const result = getPageCoords(evt);
  const x = (result.offsetX || result.pageX) / elm.offsetWidth * 100;
  const y = (result.offsetY || result.pageY) / elm.offsetHeight * 100;

  return `${x}% ${y}%`;
};
