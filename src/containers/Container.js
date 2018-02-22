// @flow

import React, { PureComponent } from 'react';

import './Container.scss';

type PricesTypes = {
  children: any,
}

class Container extends PureComponent<PricesTypes> {
  render() {
    return (
      <div styleName="container">
        { this.props.children }
      </div>
    );
  }
}

export default Container;
