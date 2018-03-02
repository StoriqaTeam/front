// @flow

import React from 'react';

import './Separator.scss';

type PropTypes = {
  text: string,
};

const Separator = (props: PropTypes) => (
  <hr
    styleName="container"
    text={props.text}
  />
);

export default Separator;
