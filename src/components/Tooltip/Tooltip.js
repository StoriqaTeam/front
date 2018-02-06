// @flow

import React from 'react';

import './Tooltip.scss';

type PropTypes = {
  text: string
};

const Tooltip = (props: PropTypes) => (
  <div styleName="container">
    <span styleName="tail" />
    { props.text }
  </div>
);

export default Tooltip;
