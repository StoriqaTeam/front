// @flow

import React, { PureComponent } from 'react';

import './Banner.scss';

type PropsTypes = {
  count: number,
  img: string,
}

class Banner extends PureComponent<PropsTypes> {
  render() {
    const { count, img } = this.props;
    return (
      <div styleName="container">
        <div styleName="wrap">
          <img
            src={img}
            alt="img"
          />
        </div>
      </div>
    );
  }
}

export default Banner;
