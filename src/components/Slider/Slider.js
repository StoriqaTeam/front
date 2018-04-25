// @flow

import React, { PureComponent, Fragment } from 'react';

import { SliderContainer } from 'components/Slider';
import { CardProduct } from 'components/CardProduct';
import { Banner } from 'components/Banner';

import './Slider.scss';

type PropsTypes = {
  items: Array<{
    id: ?string,
    rawId: ?string,
  }>,
  type: string,
  slidesToShow: ?number,
  seeAllUrl: ?string,
};

class Slider extends PureComponent<PropsTypes> {
  render() {
    const { type } = this.props;
    return (
      <div styleName="container">
        <SliderContainer {...this.props}>
          {this.props.items.map(item => (
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
