// @flow

import React from 'react';
import type { Node } from 'react';

import './FormGroup.scss';

type PropTypes = {
  children: Node,
};

const FormGroup = (props: PropTypes) => (
  <div styleName="container">
    { props.children }
  </div>
);

export default FormGroup;
