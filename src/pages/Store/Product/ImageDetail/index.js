// @flow strict

import React from 'react';

import { isMobileBrowser } from 'utils';

import Zoom from './svg/zoom.svg';

import './ImageDetail.scss';

import t from './i18n';

const ImageDetail = () => (
  <p styleName="container">
    <span styleName="zoom">
      <Zoom />
    </span>
    {isMobileBrowser() ? t.touchAndDrag : t.moveYourMouse}
  </p>
);

export default ImageDetail;
