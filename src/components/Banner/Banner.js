// @flow

import React, { PureComponent, Fragment } from 'react';

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
      <Fragment>
        {item.link ? (
          <a
            styleName="container"
            href={item.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div styleName="wrap">
              <ImageLoader fit left src={item.img} loader={<BannerLoading />} />
            </div>
          </a>
        ) : (
          <div styleName="container">
            <div styleName="wrap">
              <ImageLoader fit left src={item.img} loader={<BannerLoading />} />
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

export default Banner;
