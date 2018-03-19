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
  onChange: (e: {target: { value: string }}) => void,
  icon: ?string,
  isUrl: ?boolean,
};

type StateType = {
  labelFloat: boolean,
  isFocus: boolean,
};

class Input extends Component<PropsType, StateType> {
  state = {
    labelFloat: false,
    isFocus: false,
  }

  componentWillMount() {
    this.setState({ labelFloat: Boolean(this.props.value) });
  }

  input: ?HTMLInputElement;

  handleChange = (e: any) => {
    const { value } = e.target;
    if (value.length <= 50 || this.props.isUrl) {
      this.props.onChange(value.replace(/\s\s/, ' '));
    }
  };

  handleFocus = () => {
    this.setState({
      labelFloat: !this.state.labelFloat || true,
      isFocus: true,
    });
  };

  handleBlur = () => {
    const { value } = this.props;
    this.setState({
      labelFloat: Boolean(value) && value.length > 0,
      isFocus: false,
    });
  };

  render() {
    const {
      id,
      value,
      label,
      errors,
      icon,
      isUrl,
    } = this.props;

    const {
      labelFloat,
      isFocus,
    } = this.state;

    return (
      <label
        htmlFor={id}
        styleName={classNames(
          'container',
          errors && 'isError',
          isFocus && 'isFocus',
          icon && 'isIcon',
        )}
      >
        {label &&
          <span styleName={classNames('label', { labelFloat })}>
            {label}
          </span>
        }
        {icon &&
          <div styleName="icon">
            <Icon type={icon} />
          </div>
        }
        <div styleName="input">
          <input
            id={id}
            name={id}
            type="text"
            value={value}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          <hr />
        </div>
        {errors && errors.length > 0 &&
          <div styleName="errors">
            {errors.map((item, idx) => (
              <div key={/* eslint-disable */idx/* eslint-enable */} styleName="error">{item}</div>
            ))}
          </div>
        }
        {isFocus && !isUrl &&
          <div styleName={classNames(
              'valueLength',
              value.length === 50 && 'maxValueLength',
            )}
          >
            {value.length} / 50
          </div>
        }
      </label>
    );
  }
}

export default Input;
