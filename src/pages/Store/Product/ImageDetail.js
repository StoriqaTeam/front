// @flow

import React from 'react';

import Zoom from './svg/zoom.svg';

import './ImageDetail.scss';

const ImageDetail = () => (
  <p styleName="container">
    <span styleName="zoom">
      <Zoom />
    </span>Move your mouse to see the details
  </p>
);

export default ImageDetail;
