// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import TextareaAutosize from 'react-autosize-textarea';
import { Icon } from 'components/Icon';

import './Textarea.scss';

type PropsType = {
  id: string,
  value: string,
  label: string,
  errors: ?Array<string>,
  onChange: (e: {target: { value: string }}) => void,
  forForm: ?boolean,
};

type StateType = {
  labelFloat: boolean,
  isFocus: boolean,
};

class Textarea extends Component<PropsType, StateType> {
  state = {
    labelFloat: false,
    isFocus: false,
  }

  componentWillMount() {
    this.setState({ labelFloat: Boolean(this.props.value) });
  }

  handleChange = (e: any) => {
    const { value } = e.target;
    this.props.onChange(value);
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
      forForm,
    } = this.props;

    const {
      labelFloat,
      isFocus,
    } = this.state;

    return (
      <label
        htmlFor={id}
        styleName={classNames('container', { isError: errors })}
      >
        <span styleName={classNames('label', { labelFloat })}>
          {label}
          {forForm && !isFocus &&
          <div styleName="editIcon">
            <Icon type="pencil" />
          </div>
          }
        </span>
        <div styleName={classNames('textarea', { textareaForForm: forForm })}>
          <TextareaAutosize
            id={id}
            name={id}
            value={value}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </div>
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

export default Textarea;
