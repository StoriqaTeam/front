// @flow

import React from 'react';

import './Separator.scss';

type PropTypes = {
  text: string,
};

const Separator = (props: PropTypes) => (
  <hr styleName="separator" text={props.text} />
);

export default Separator;
