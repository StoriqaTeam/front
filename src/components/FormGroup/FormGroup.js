// @flow

import React from 'react';
import type { Node } from 'react';

import './FormGroup.scss';

type PropTypes = {
  marginBottom?: number,
  children: Node,
};

const FormGroup = (props: PropTypes) => (
  <div
    style={{ marginBottom: props.marginBottom }}
    styleName="container"
  >
    { props.children }
  </div>
);

FormGroup.defaultProps = {
  marginBottom: 40,
};

export default FormGroup;
