// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import { Icon } from 'components/Icon';

import './Input.scss';

type PropsType = {
  id: string,
  value: string,
  label: string,
  errors: ?Array<string>,
  onChange: (e: { target: { value: string } }) => void,
  onBlur: () => void,
  onFocus: () => void,
  onKeyDown: () => void,
  onClick: () => void,
  icon: ?string,
  isUrl: ?boolean,
  inputRef: ?(e: any) => void,
  isAutocomplete: ?boolean,
  limit: ?number,
};

type StateType = {
  labelFloat: boolean,
  isFocus: boolean,
};

class Input extends Component<PropsType, StateType> {
  state = {
    labelFloat: false,
    isFocus: false,
  };

  componentWillMount() {
    this.setState({ labelFloat: Boolean(this.props.value) });
  }

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

  handleBlur = () => {
    const { value, onBlur } = this.props;
    this.setState({
      labelFloat: Boolean(value) && value.length > 0,
      isFocus: false,
    });
    if (onBlur) onBlur();
  };

  renderInput() {
    const { onChange, inputRef, isAutocomplete, id, value } = this.props;
    return isAutocomplete ? (
      <input
        id={id}
        name={id}
        type="text"
        ref={inputRef}
        value={this.props.value || ''}
        onChange={onChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onKeyDown={this.props.onKeyDown}
        onClick={this.props.onClick}
        data-test={id}
      />
    ) : (
      <input
        id={id}
        name={id}
        type="text"
        value={value || ''}
        onChange={onChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        data-test={id}
      />
    );
  }

  render() {
    const { id, value, label, errors, icon, isUrl, limit } = this.props;
    const { labelFloat, isFocus } = this.state;
    return (
      <label
        htmlFor={id}
        styleName={classNames('container', {
          isError: errors,
          isFocus,
          isIcon: icon,
        })}
      >
        {label && (
          <span styleName={classNames('label', { labelFloat })}>{label}</span>
        )}
        {icon && (
          <div styleName="icon">
            <Icon type={icon} />
          </div>
        )}
        <div styleName="input">
          {this.renderInput()}
          <hr />
        </div>
        {errors &&
          errors.length > 0 && (
            <div styleName="errors">
              {errors.map((item, idx) => (
                <div key={/* eslint-disable */ idx /* eslint-enable */}>
                  {item}
                </div>
              ))}
            </div>
          )}
        {isFocus &&
          !isUrl &&
          limit && (
            <div
              styleName={classNames('valueLength', {
                maxValueLength: value && value.length === limit,
              })}
            >
              {value ? value.length : 0} / {limit}
            </div>
          )}
      </label>
    );
  }
}

export default Input;
