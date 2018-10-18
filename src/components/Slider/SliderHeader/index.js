// @flow strict

import React, { PureComponent } from 'react';
import { isNil } from 'ramda';

import { Icon } from 'components/Icon';

import './SliderHeader.scss';

import t from './i18n';

type PropsTypes = {
  title: string,
  isRevealButton: boolean,
  handleSlide: string => void,
  seeAllUrl: ?string,
};

class SliderHeader extends PureComponent<PropsTypes> {
  render() {
    const { title, isRevealButton, handleSlide, seeAllUrl } = this.props;

    return (
      <div styleName="container">
        <div styleName="title">{title}</div>
        {isRevealButton && (
          <div styleName="nav">
            <button
              direction="prev"
              styleName="button"
              onClick={() => handleSlide('prev')}
            >
              <Icon type="prev" size={32} />
            </button>
            <button
              direction="next"
              styleName="button"
              onClick={() => handleSlide('next')}
            >
              <Icon type="next" size={32} />
            </button>
          </div>
        )}
        {!isNil(seeAllUrl) && (
          <a styleName="reveal" href={seeAllUrl} data-test="seeAllLink">
            {t.seeAll}
          </a>
        )}
        {false && <a styleName="settings">{t.recommendationSettings}</a>}
      </div>
    );
  }
}

export default SliderHeader;
