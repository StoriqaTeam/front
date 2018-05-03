// @flow

import React, { Component } from 'react';
import cn from 'classnames';
import { pathOr } from 'ramda';

import './CartTotal.scss';

type PropsType = {
  threshold: number,
  top: ?number,
  bottom: ?number,
};

type StateType = {
  currentClass: 'sticky' | 'top' | 'bottom',
};

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
    let height = 0;
    if (this.ref) {
      const rect = this.ref.getBoundingClientRect();
      height = rect.bottom - rect.top;
    }

    const offset = window.pageYOffset;
    let currentClass = 'top';
    if (this.props.top && (offset >= this.props.top)) { currentClass = 'sticky'; }
    if (this.props.bottom && (offset + height >= this.props.bottom)) { currentClass = 'bottom'; }
    if (currentClass !== this.state.currentClass) { this.setState({ currentClass }); }
    // const rem = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    // const threshold = this.props.threshold * rem;
    // console.log(offset, this.props.threshold);
    // this.setState({ sticky: offset > this.props.threshold });
  }

  render() {
    console.log("Props: ", this.props);
    console.log("State: ", this.state);
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
