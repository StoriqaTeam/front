// @flow

import React, { Component } from 'react';
import classNames from 'classnames';

import './AutocompleteInput.scss';

type PropsType = {
  id: string,
  value: string,
  label: string,
  onChange: (e: { target: { value: string } }) => void,
  onBlur: (e: { target: { value: string } }) => void,
  onFocus: () => void,
  onKeyDown: () => void,
  onClick: () => void,
  inputRef: ?(e: any) => void,
};

type StateType = {
  labelFloat: boolean,
  isFocus: boolean,
};

class AutocompleteInput extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    if (Boolean(nextProps.value) !== prevState.labelFloat) {
      return {
        ...prevState,
        labelFloat: prevState.isFocus ? true : Boolean(nextProps.value),
      };
    }

    return null;
  }

  state = {
    labelFloat: false,
    isFocus: false,
  };

  input: ?HTMLInputElement;

  handleChange = (e: any) => {
    const { onChange } = this.props;
    onChange(e);
  };

  handleFocus = () => {
    const { onFocus } = this.props;
    this.setState({
      labelFloat: !this.state.labelFloat || true,
      isFocus: true,
    });
    if (onFocus) onFocus();
  };

  handleBlur = (e: any) => {
    const { value, onBlur } = this.props;
    this.setState({
      labelFloat: Boolean(value) && value.length > 0,
      isFocus: false,
    });
    if (onBlur) onBlur(e);
  };

  render() {
    const { id, value, label, inputRef, onChange } = this.props;
    const { labelFloat, isFocus } = this.state;

    return (
      <label htmlFor={id} styleName={classNames('container', { isFocus })}>
        {label && (
          <span
            styleName={classNames('label', { labelFloat: labelFloat || value })}
          >
            {label}
          </span>
        )}
        <div styleName="input">
          <input
            type="text"
            ref={inputRef}
            value={value || ''}
            onChange={onChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onKeyDown={this.props.onKeyDown}
            onClick={this.props.onClick}
            data-test="autocompleteAddress"
          />
          <hr />
        </div>
      </label>
    );
  }
}

export default AutocompleteInput;
