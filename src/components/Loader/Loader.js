// @flow strict

import React from 'react';

import { Spinner } from 'components/common/Spinner';

import './Loader.scss';

const Loader = () => (
  <div styleName="container">
    <Spinner />
  </div>
);

export default Loader;
