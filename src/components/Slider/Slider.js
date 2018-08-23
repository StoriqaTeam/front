// @flow

import React, { Component, Fragment } from 'react';

import { SliderContainer } from 'components/Slider';
import { CardProduct } from 'components/CardProduct';
import { Banner } from 'components/Banner';

import './Slider.scss';

type StateTypes = {
  dotIdx: number,
};

type PropsTypes = {
  items: Array<{
    id: ?string,
    rawId: ?string,
  }>,
  type: string,
  slidesToShow: ?number,
  seeAllUrl: ?string,
  autoplaySpeed?: number,
  fade?: boolean,
};

class Slider extends Component<PropsTypes, StateTypes> {
  state = {
    dotIdx: 0,
  };

  getValueDotIdx = (dotIdx: number) => {
    this.setState({ dotIdx });
  };

  render() {
    const { items, type, fade } = this.props;
    const { dotIdx } = this.state;
    const fadeData = fade
      ? {
          getValueDotIdx: this.getValueDotIdx,
          dotIdx,
        }
      : {};
    return (
      <div styleName="container">
        <SliderContainer {...this.props} {...fadeData}>
          {items.map(item => (
            <Fragment key={item.rawId || item.id}>
              {type === 'products' && <CardProduct item={item} />}
              {type === 'banners' && <Banner item={item} />}
            </Fragment>
          ))}
        </SliderContainer>
      </div>
    );
  }
}

export default Slider;
