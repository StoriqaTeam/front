// @flow strict

import { any } from 'ramda';

/**
 * @link https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
 */
export default function isMobileBrowser(): boolean {
  const regexes = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  return process.env.BROWSER
    ? any(regex => regex.test(navigator.userAgent))(regexes)
    : false;
}
