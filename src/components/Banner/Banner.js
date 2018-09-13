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
};

class Banner extends PureComponent<PropsTypes> {
  render() {
    const { item } = this.props;
    return (
      <a styleName="container" href={item.link}>
        <div styleName="wrap">
          <ImageLoader fit left src={item.img} loader={<BannerLoading />} />
        </div>
      </a>
    );
  }
}

export default Banner;
