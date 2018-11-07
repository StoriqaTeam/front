// @flow strict

import React from 'react';

import './StartSellingButton.scss';

type PropsType = {
  text: string,
  onClick: () => void,
};

const StartSellingButton = ({ text, onClick }: PropsType) => (
  <div
    role="button"
    tabIndex="-1"
    onKeyPress={() => {}}
    onClick={onClick}
    styleName="container"
    data-test="startSelling"
    target="blank_"
  >
    <p styleName="text">{text}</p>
  </div>
);

export default StartSellingButton;
