// @flow

import React, { Component } from 'react';
import cn from 'classnames';

import './CartTotal.scss';

type PropsType = {
  storesRef: ?Object;
};

type StateType = {
  currentClass: 'sticky' | 'top' | 'bottom',
};

const STICKY_PADDING_TOP_REM = 2;

class CartTotal extends Component<PropsType, StateType> {
  state = {
    currentClass: 'top',
  };

  componentDidMount() {
    if (!window) return;
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    if (!window) return;
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  setRef(ref: ?Object) {
    this.ref = ref;
  }

  ref: ?Object;

  handleScroll() {
    if (!window) return;
    if (!this.ref || !this.props.storesRef) return;
    const offset = window.pageYOffset;
    const rect = this.ref.getBoundingClientRect();
    const height = rect.bottom - rect.top;
    // $FlowIgnoreMe
    const { top: viewTop, bottom: viewBottom } = this.props.storesRef.getBoundingClientRect();
    const rem = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    const top = viewTop + (offset - (STICKY_PADDING_TOP_REM * rem));
    const bottom = viewBottom + (offset - (STICKY_PADDING_TOP_REM * rem));
    let currentClass = 'top';
    if (offset >= top) { currentClass = 'sticky'; }
    if (offset + height >= bottom) { currentClass = 'bottom'; }
    if (currentClass !== this.state.currentClass) { this.setState({ currentClass }); }
  }

  render() {
    // const { products } = this.props.store;
    return (
      <div styleName={cn('container', this.state.currentClass)} ref={ref => this.setRef(ref)}>
        <div styleName="cart-total-title">
          Total
        </div>
      </div>
    );
  }
}

export default CartTotal;
