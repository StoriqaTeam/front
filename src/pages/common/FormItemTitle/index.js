// @flow strict

import React from 'react';

import './FormItemTitle.scss';

const FormItemTitle = ({ title }: { title: string }) => (
  <div styleName="container">
    <strong>{title}</strong>
  </div>
);

export default FormItemTitle;
