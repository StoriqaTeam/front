// @flow

import React from 'react';

import Zoom from './svg/zoom.svg';

import './ImageDetail.scss';

const ImageDetail = () => (
  <p styleName="container">
    <span styleName="zoom">
      <Zoom />
    </span>Наведите курсором, чтобы рассмотреть детали
  </p>
);

export default ImageDetail;
