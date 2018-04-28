// @flow

import React, { PureComponent } from 'react';

import './Container.scss';

type PropsTypes = {
  children: any,
};

class Container extends PureComponent<PropsTypes> {
  render() {
    return <div styleName="container">{this.props.children}</div>;
  }
}

export default Container;
