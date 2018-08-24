// @flow

import React from 'react';

import './StartSellingButton.scss';

type PropsType = {
  text: string,
  onClick: () => any,
};

const StartSellingButton = ({ text, onClick }: PropsType) => (
  <div
    role="button"
    tabIndex="-1"
    onKeyPress={() => {}}
    onClick={onClick}
    styleName="container"
  >
    <p styleName="text">{text}</p>
  </div>
);

export default StartSellingButton;
