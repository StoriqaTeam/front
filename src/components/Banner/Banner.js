// @flow

import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';

import MediaQuery from 'libs/react-responsive';
import ImageLoader from 'libs/react-image-loader';

import BannerLoading from './BannerLoading';

import './Banner.scss';

type ItemType = {
  count: number,
  img: string,
  link: string,
};
type BannerType = 'single' | 'double';
type PropsTypes = {
  item: ItemType,
  type: BannerType,
};

class Banner extends PureComponent<PropsTypes> {
  renderImageLoader = (item: ItemType, type: BannerType) => (
    <div
      styleName={classNames('wrap', {
        single: type === 'single',
        double: type === 'double',
      })}
    >
      {type === 'single' && (
        <Fragment>
          <MediaQuery maxWidth={575}>
            <ImageLoader fit left src={item.img} loader={<BannerLoading />} />
          </MediaQuery>
          <MediaQuery minWidth={576}>
            <ImageLoader fit src={item.img} loader={<BannerLoading />} />
          </MediaQuery>
        </Fragment>
      )}
      {type === 'double' && (
        <ImageLoader fit left src={item.img} loader={<BannerLoading />} />
      )}
    </div>
  );

  render() {
    const { item, type } = this.props;
    return (
      <Fragment>
        {item.link ? (
          <a styleName="container" href={item.link}>
            {this.renderImageLoader(item, type)}
          </a>
        ) : (
          <div styleName="container">{this.renderImageLoader(item, type)}</div>
        )}
      </Fragment>
    );
  }
}

export default Banner;
