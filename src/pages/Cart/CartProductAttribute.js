// @flow

import React, { PureComponent } from 'react';

import './CartProductAttribute.scss';

type PropsType = {
  title: string | any,
  value: string | any,
};

class CartProductAttribute extends PureComponent<PropsType> {
  render() {
    return (
      <div styleName="container">
        <div styleName="title">{this.props.title}</div>
        <div styleName="value">{this.props.value}</div>
      </div>
    );
  }
}

export default CartProductAttribute;
