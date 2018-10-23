// @flow

import React from 'react';

import './StartSellingButton.scss';

type PropsType = {
  text: string,
  href: string,
};

const StartSellingButton = ({ text, href }: PropsType) => (
  <a
    role="button"
    tabIndex="-1"
    onKeyPress={() => {}}
    href={href}
    styleName="container"
    data-test="startSelling"
    target="blank_"
  >
    <span styleName="text">{text}</span>
  </a>
);

export default StartSellingButton;
