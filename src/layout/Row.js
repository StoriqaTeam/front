// @flow

import React, { PureComponent } from 'react';

import './Row.scss';

type PropsTypes = {
  children: any,
};

class Row extends PureComponent<PropsTypes> {
  render() {
    return <div styleName="container">{this.props.children}</div>;
  }
}

export default Row;
