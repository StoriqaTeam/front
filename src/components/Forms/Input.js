// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
// import { specs, validate } from '@storiqa/validation_specs';

// import { log } from 'utils';

import './Input.scss';

type PropsType = {
  id: string,
  name: string,
  value: string,
  label: string,
  errors: ?Array<string>,
  // $FlowIgnore
  onChange: (e: {target: { value: string }}) => void,
  withStateChanges: boolean,
};

type StateType = {
  value: string,
  labelFloat: boolean,
};

class Input extends Component<PropsType, StateType> {
  state = {
    value: '',
    labelFloat: false,
  }

  componentWillMount() {
    this.setState({ labelFloat: Boolean(this.props.value) });
  }

  handleChange = (e: {target: { value: string }}) => {
    const { value } = e.target;

    if (this.props.withStateChanges) {
      this.setState({ value });
      // this.value.innerHTML = value;
      // const valueOffsetWidth = this.value.offsetWidth;
      // this.input.style.minWidth = valueOffsetWidth < 240 ? '240px' : `${valueOffsetWidth}px`;
    } else {
      this.props.onChange(value);
    }
  };

  handleFocus = () => {
    this.setState({ labelFloat: !this.state.labelFloat || true });
  };

  handleBlur = () => {
    this.setState({ labelFloat: this.state.value || this.props.value });
  };

  render() {
    const {
      id,
      name,
      value,
      label,
      errors,
    } = this.props;

    const {
      value: stateValue,
      labelFloat,
    } = this.state;

    return (
      <label
        htmlFor={id}
        styleName={classNames('container', { isError: errors })}
      >
        <span styleName={classNames('label', { labelFloat })}>{label}</span>
        <input
          ref={(node) => { this.input = node; }}
          id={id}
          name={name}
          type="text"
          value={value || stateValue}
          styleName="input"
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        <div
          ref={(node) => { this.value = node; }}
          styleName="value"
        />
        {errors && errors.length > 0 &&
          <div className="errors">
            {errors.map((item, idx) => (
              <div key={/* eslint-disable */idx/* eslint-enable */} styleName="error">{item}</div>
            ))}
          </div>
        }
      </label>
    );
  }
}

export default Input;
