// @flow

import React, { Component, Fragment } from 'react';

import { SliderContainer } from 'components/Slider';
import { CardProduct } from 'components/CardProduct';
import { Banner } from 'components/Banner';
import BannerLoading from 'components/Banner/BannerLoading';
import ImageLoader from 'libs/react-image-loader';

import './Slider.scss';

type StateTypes = {
  dotIdx: number,
};

type PropsTypes = {
  items: Array<{
    id: ?string,
    rawId: ?string,
    img: ?string,
  }>,
  type: 'products' | 'banners' | 'image',
  slidesToShow: ?number,
  seeAllUrl: ?string,
  autoplaySpeed?: number,
  fade?: boolean,
  arrows?: boolean,
};

class Slider extends Component<PropsTypes, StateTypes> {
  state = {
    dotIdx: 0,
  };

  getValueDotIdx = (dotIdx: number): void => {
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
              {type === 'image' && (
                <ImageLoader
                  fit
                  src={item.img}
                  loader={
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      }}
                    >
                      <BannerLoading />
                    </div>
                  }
                />
              )}
            </Fragment>
          ))}
        </SliderContainer>
      </div>
    );
  }
}

export default Slider;
