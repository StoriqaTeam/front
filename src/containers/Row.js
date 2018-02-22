// @flow

import React, { PureComponent } from 'react';

import './Row.scss';

type PricesTypes = {
  children: any,
}

class Row extends PureComponent<PricesTypes> {
  render() {
    return (
      <div styleName="container">
        { this.props.children }
      </div>
    );
  }
}

export default Row;
