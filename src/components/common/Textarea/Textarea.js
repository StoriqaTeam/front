// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import TextareaAutosize from 'react-autosize-textarea';

import './Textarea.scss';

type PropsType = {
  id?: string,
  value: string,
  label: string,
  errors?: Array<string>,
  onBlur?: () => void,
  onChange: (e: SyntheticInputEvent<HTMLInputElement>) => void,
  fullWidth: ?boolean,
};

type StateType = {
  labelFloat: boolean,
  isFocus: boolean,
};

class Textarea extends Component<PropsType, StateType> {
  state = {
    labelFloat: false,
    isFocus: false,
  };

  componentWillMount() {
    this.setState({ labelFloat: Boolean(this.props.value) });
  }

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    onChange(e);
  };

  handleFocus = () => {
    this.setState(prevState => ({
      labelFloat: !prevState.labelFloat || true,
      isFocus: true,
    }));
  };

  handleBlur = () => {
    const { value, onBlur } = this.props;
    this.setState({
      labelFloat: Boolean(value) && value.length > 0,
      isFocus: false,
    });
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const { id, value, label, errors, fullWidth } = this.props;

    const { labelFloat, isFocus } = this.state;

    return (
      <label
        htmlFor={id}
        styleName={classNames('container', {
          isError: errors,
          isFocus,
          fullWidth,
        })}
      >
        <span styleName={classNames('label', { labelFloat })}>{label}</span>
        <div styleName="textarea">
          <TextareaAutosize
            id={id}
            name={id}
            value={value}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            data-test={id}
          />
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
      </label>
    );
  }
}

export default Textarea;
