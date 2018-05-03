// @flow

import React, { Component } from 'react';
import { isNil, isEmpty } from 'ramda';

import { Icon } from 'components/Icon';

import './Stepper.scss';

// min and max - boundary range, both inclusive. E.g. min = 1, max = 3 => range = [1, 2, 3]
type PropsType = {
  min?: ?number,
  max?: ?number,
  value: number,
  onChange: (value: number) => void,
};

type StateType = {
  inputValue: ?number,
}

type Action = 'increase' | 'decrease';

class Stepper extends Component<PropsType, StateType> {
  state = {
    inputValue: 0,
  }

  valid(val: number): boolean {
    return (
      // $FlowIgnore
      (isNil(this.props.min) || val >= this.props.min) &&
      // $FlowIgnore
      (isNil(this.props.max) || val <= this.props.max)
    );
  }

  // coerce intput value to valid range
  coerce(val: ?number): number {
    let value = isNil(val) ? (this.props.min || this.props.max || 0) : val;
    if (!isNil(this.props.min)) {
      // $FlowIgnore
      value = Math.max(this.props.min, value);
    }
    if (!isNil(this.props.max)) {
      // $FlowIgnore
      value = Math.min(this.props.max, value);
    }
    // $FlowIgnore
    return value;
  }

  handleClick(action: Action) {
    const newVal = action === 'increase' ? this.props.value + 1 : this.props.value - 1;
    if (this.valid(newVal)) {
      this.setState({ inputValue: newVal });
      this.props.onChange(newVal);
    }
  }

  handleChange(e: { target: { value: ?string } }) {
    if (isEmpty(e.target.value)) {
      this.setState({ inputValue: null });
      return;
    }
    const value = parseInt(e.target.value, 10);
    // eslint-disable-next-line
    if (isNaN(value)) return;
    this.setState({ inputValue: value });
  }

  handleBlur() {
    const value = this.coerce(this.state.inputValue);
    this.setState({ inputValue: value });
    this.props.onChange(value);
  }

  render() {
    return (
      <div styleName="container">
        <button styleName="button" onClick={() => this.handleClick('decrease')}>
          <Icon type="minus" size="16" />
        </button>
        <input
          styleName="input"
          type="text"
          onBlur={() => this.handleBlur()}
          onChange={e => this.handleChange(e)}
          value={isNil(this.state.inputValue) ? '' : this.state.inputValue}
        />
        <button styleName="button" onClick={() => this.handleClick('increase')}>
          <Icon type="plus" size="16" />
        </button>
      </div>
    );
  }
}

export default Stepper;
