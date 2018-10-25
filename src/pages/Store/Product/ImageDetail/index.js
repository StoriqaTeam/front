// @flow strict

import React from 'react';

import Zoom from './svg/zoom.svg';

import './ImageDetail.scss';

import t from './i18n';

const ImageDetail = () => (
  <p styleName="container">
    <span styleName="zoom">
      <Zoom />
    </span>{t.moveYourMouseToSeeTheDetails}
  </p>
);

export default ImageDetail;
