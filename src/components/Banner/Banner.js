// @flow

import React, { PureComponent } from 'react';

import ImageLoader from 'libs/react-image-loader';

import BannerLoading from './BannerLoading';

import './Banner.scss';

type PropsTypes = {
  item: {
    count: number,
    img: string,
    link: string,
  },
}

class Banner extends PureComponent<PropsTypes> {
  render() {
    const { item } = this.props;
    return (
      <div
        styleName="container"
        target="_blank"
      >
        <div styleName="wrap">
          <ImageLoader
            src={item.img}
            loader={<BannerLoading />}
          />
        </div>
      </div>
    );
  }
}

export default Banner;
