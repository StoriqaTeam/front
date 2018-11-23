// @flow strict

import React from 'react';

import { isMobileBrowser } from 'utils';

import Zoom from './svg/zoom.svg';

import './ImageDetail.scss';

const ImageDetail = () => (
  <p styleName="container">
    <span styleName="zoom">
      <Zoom />
    </span>
    {isMobileBrowser() ? 'Touch and drag' : 'Move your mouse'} to see the
    details
  </p>
);

export default ImageDetail;
