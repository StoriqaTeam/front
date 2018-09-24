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
  onBlur: (e: any) => void,
  onFocus: (e: any) => void,
  onKeyDown: () => void,
  onClick: () => void,
  min: ?string,
  icon: string,
  isUrl: ?boolean,
  inputRef: ?(e: any) => void,
  isAutocomplete: ?boolean,
  limit: ?number,
  type?: string,
  fullWidth?: boolean,
  postfix: ?string,
  dataTest: ?string,
  inline: ?boolean,
  search?: boolean,
  align?: 'center' | 'left' | 'right',
};

type StateType = {
  labelFloat: boolean,
  isFocus: boolean,
};

class Input extends Component<PropsType, StateType> {
  static defaultProps = {
    icon: '',
  };
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    const value = nextProps.value == null ? '' : `${nextProps.value}`;
    if (Boolean(value) !== prevState.labelFloat) {
      return {
        ...prevState,
        labelFloat: prevState.isFocus ? true : Boolean(value),
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

  handleFocus = (e: any) => {
    const { onFocus } = this.props;
    this.setState({
      labelFloat: !this.state.labelFloat || true,
      isFocus: true,
    });
    if (onFocus) onFocus(e);
  };

  handleBlur = (e: any) => {
    const { value, onBlur } = this.props;
    this.setState({
      labelFloat: Boolean(value) && value.length > 0,
      isFocus: false,
    });
    if (onBlur) onBlur(e);
  };

  renderInput() {
    const {
      onChange,
      inputRef,
      isAutocomplete,
      id,
      value,
      type,
      min,
      dataTest,
      align,
    } = this.props;
    return isAutocomplete ? (
      <input
        type="text"
        ref={inputRef}
        value={this.props.value || ''}
        onChange={onChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onKeyDown={this.props.onKeyDown}
        onClick={this.props.onClick}
        data-test={dataTest || id}
        style={{ textAlign: align || 'left' }}
      />
    ) : (
      <input
        id={id}
        ref={inputRef}
        name={id}
        type={type || 'text'}
        value={value || ''}
        min={min || ''}
        onChange={onChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onKeyDown={this.props.onKeyDown}
        data-test={dataTest || id}
        style={{ textAlign: align || 'left' }}
      />
    );
  }

  render() {
    const {
      id,
      value,
      label,
      errors,
      icon,
      isUrl,
      limit,
      fullWidth,
      postfix,
      inline,
      search,
    } = this.props;
    const { labelFloat, isFocus } = this.state;
    return (
      <label
        htmlFor={id}
        styleName={classNames('container', {
          isFocus,
          isError: errors,
          isIcon: icon || search,
          isSearch: search,
          fullWidth,
          inline,
        })}
      >
        {label && (
          <span
            styleName={classNames('label', { labelFloat: labelFloat || value })}
          >
            {label}
          </span>
        )}
        {(icon || search) && (
          <div styleName="icon">
            <Icon type={search ? 'magnifier' : icon} />
          </div>
        )}
        <div styleName="input">
          <div styleName="inputContent">
            {this.renderInput()}
            {postfix && <span styleName="postfix">{postfix}</span>}
          </div>
          <hr />
        </div>
        {errors &&
          errors.length > 0 && (
            <div styleName="errors">
              {errors.map((item, idx) => (
                <div
                  key={/* eslint-disable */ idx /* eslint-enable */}
                  id={`error-label-${id}`}
                >
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
