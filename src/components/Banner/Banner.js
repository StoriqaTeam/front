// @flow

import React, { PureComponent } from 'react';

import './Banner.scss';

type PropsTypes = {
  banner: {
    count: number,
    img: string,
    link: string,
  },
}

class Banner extends PureComponent<PropsTypes> {
  render() {
    const { banner } = this.props;
    return (
      <a
        href={banner.link}
        styleName="container"
        target="_blank"
      >
        <div styleName="wrap">
          <img
            src={banner.img}
            alt="img"
          />
        </div>
      </a>
    );
  }
}

export default Banner;
