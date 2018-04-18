import React, { PureComponent } from 'react';

import { Icon } from 'components/Icon';

import './SliderHeader.scss';

type PropsTypes = {
  title: string,
  isRevealButton: boolean,
  handleSlide: Function,
};

class SliderHeader extends PureComponent<PropsTypes> {
  render() {
    const {
      title,
      isRevealButton,
      handleSlide,
    } = this.props;

    return (
      <div styleName="container">
        <div styleName="title">{title}</div>
        {isRevealButton &&
          <div styleName="nav">
            <button
              direction="prev"
              styleName="button"
              onClick={() => handleSlide('prev')}
            >
              <Icon type="prev" size="32" />
            </button>
            <button
              direction="next"
              styleName="button"
              onClick={() => handleSlide('next')}
            >
              <Icon type="next" size="32" />
            </button>
          </div>
        }
        <a styleName="reveal">See all</a>
        {false && <a styleName="settings">Recommendations settings</a>}
      </div>
    );
  }
}

export default SliderHeader;
