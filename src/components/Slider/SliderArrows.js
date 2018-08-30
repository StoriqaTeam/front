// @flow

import React, { Fragment } from 'react';

import { Icon } from 'components/Icon';

import './SliderArrows.scss';

type PropsType = {
  onClick: string => any,
};

const SliderArrows = ({ onClick }: PropsType) => (
  <Fragment>
    <span
      styleName="arrow left"
      onClick={() => onClick('prev')}
      onKeyDown={() => {}}
      role="button"
      tabIndex="-1"
    >
      <Icon type="leftArrowSlider" size={28} />
    </span>
    <span
      styleName="arrow right"
      onClick={() => onClick('next')}
      onKeyDown={() => {}}
      role="button"
      tabIndex="-1"
    >
      <Icon type="rightArrowSlider" size={28} />
    </span>
  </Fragment>
);

export default SliderArrows;
