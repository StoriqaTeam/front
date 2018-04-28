// @flow

import React, { Component } from 'react';
import cn from 'classnames';

import './CartTotal.scss';

type PropsType = {
  threshold: number,
};

type StateType = {
  sticky: boolean,
};

class CartTotal extends Component<PropsType, StateType> {
  state = {
    sticky: false,
  };

  componentDidMount() {
    if (!window) return;
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    if (!window) return;
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  setRef(ref: Object) {
    this.ref = ref;
  }

  ref: ?Object;

  handleScroll() {
    if (!window) return;
    const offset = window.pageYOffset;
    // const rem = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    // const threshold = this.props.threshold * rem;
    console.log(offset, this.props.threshold);
    this.setState({ sticky: offset > this.props.threshold });
  }

  render() {
    // const { products } = this.props.store;
    return (
      <div styleName={cn('container', { sticky: this.state.sticky })}>
        <div styleName="cart-total-title">
          Total
        </div>
      </div>
    );
  }
}

export default CartTotal;
