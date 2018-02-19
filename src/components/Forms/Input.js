// @flow

import React, { Component } from 'react';
import classNames from 'classnames';

import './Input.scss';

type PropsType = {
  id: string,
  value: string,
  label: string,
  errors: ?Array<string>,
  onChange: (e: {target: { value: string }}) => void,
};

type StateType = {
  labelFloat: boolean,
};

class Input extends Component<PropsType, StateType> {
  state = {
    labelFloat: false,
  }

  componentWillMount() {
    this.setState({ labelFloat: Boolean(this.props.value) });
  }

  handleChange = (e: {target: { value: string }}) => {
    this.props.onChange(e.target.value);
  };

  handleFocus = () => {
    this.setState({ labelFloat: !this.state.labelFloat || true });
  };

  handleBlur = () => {
    this.setState({ labelFloat: this.props.value });
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
          name={id}
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
