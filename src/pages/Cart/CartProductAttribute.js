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
        <p styleName="title">{this.props.title}</p>
        <p styleName="value">{this.props.value}</p>
      </div>
    );
  }
}

export default CartProductAttribute;
