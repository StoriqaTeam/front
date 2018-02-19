// @flow

import React, { Component } from 'react';
// import type { Node } from 'react';
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

  input: ?HTMLInputElement;

  handleChange = (e: any) => {
    this.props.onChange(e.target.value);
  };

  handleFocus = () => {
    this.setState({ labelFloat: !this.state.labelFloat || true });
  };

  handleBlur = () => {
    const { value } = this.props;
    this.setState({ labelFloat: Boolean(value) && value.length > 0 });
  };

  render() {
    const {
      id,
      value,
      label,
      errors,
    } = this.props;

    const {
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
          value={value}
          styleName="input"
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
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
