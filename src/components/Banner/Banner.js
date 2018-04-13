// @flow

import React, { PureComponent } from 'react';

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
          <img
            src={item.img}
            alt="img"
          />
        </div>
      </div>
    );
  }
}

export default Banner;
