import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './SliderHeader.scss';

type PropsTypes = {
  type: 'most-popular' | 'sale' | 'smart-reviews',
  title: string,
  isRevealButton: boolean,
  showAllSlides: boolean,
  handleSlide: Function,
};

class SliderHeader extends PureComponent<PropsTypes> {
  render() {
    const {
      type,
      title,
      isRevealButton,
      showAllSlides,
      handleSlide,
    } = this.props;

    const titleCls = classNames('title', `${type}-color`);
    const revealCls = classNames('reveal', `${type}-color`);

    return (
      <div styleName="container">
        <div styleName={titleCls}>
          <strong>{title}</strong>
        </div>
        {isRevealButton &&
        <a
          styleName={revealCls}
        >
          See all
        </a>
        }
        {isRevealButton && !showAllSlides &&
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
      </div>
    );
  }
}

export default SliderHeader;
