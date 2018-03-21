// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import TextareaAutosize from 'react-autosize-textarea';

import './Textarea.scss';

type PropsType = {
  id: string,
  value: string,
  label: string,
  errors: ?Array<string>,
  onChange: (e: {target: { value: string }}) => void,
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
    this.setState(prevState => ({
      labelFloat: !prevState.labelFloat || true,
      isFocus: true,
    }));
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
          {
            isError: errors,
            isFocus,
          }
        )}
      >
        <span styleName={classNames('label', { labelFloat })}>
          {label}
        </span>
        <div styleName="textarea">
          <TextareaAutosize
            id={id}
            name={id}
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
              <div key={/* eslint-disable */idx/* eslint-enable */}>{item}</div>
            ))}
          </div>
        }
      </label>
    );
  }
}

export default Textarea;
