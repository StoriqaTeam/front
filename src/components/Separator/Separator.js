// @flow

import React from 'react';

import './Separator.scss';

type PropTypes = {
  text: string,
  marginBottom?: number
};

const Separator = (props: PropTypes) => (
  <hr
    style={{ marginBottom: props.marginBottom }}
    styleName="container"
    text={props.text}
  />
);

Separator.defaultProps = {
  marginBottom: 24,
};

export default Separator;
