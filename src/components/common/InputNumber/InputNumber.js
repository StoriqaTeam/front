// @flow strict

import React, { Component } from 'react';
import { omit } from 'ramda';

import { Input } from 'components/common/Input';

type StateType = {
  value: string,
};

type PropsType = {
  onChange: (value: number) => void,
  onFocus?: () => void,
  onBlur?: () => void,
  value: number,
};

class InputNumber extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    const value = `${nextProps.value}`;
    if (Number(value) !== Number(prevState.value)) {
      return { ...prevState, value };
    }
    return null;
  }

  constructor(props: PropsType) {
    super(props);
    this.state = {
      value: props.value ? `${props.value}` : '0',
    };
  }

  handleOnChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    const { onChange } = this.props;
    const regexp = /(^[0-9]*[.,]?[0-9]*$)/;
    if (regexp.test(value)) {
      this.setState({
        value:
          value
            .replace(/^0+/, '0')
            .replace(/^[.,]/, '0.')
            .replace(/^0([0-9])/, '$1')
            .replace(/,/, '.') || '0',
      });
      onChange(
        Number(
          value
            .replace(/[.,]$/, '')
            .replace(/^0([0-9])/, '$1')
            .replace(/(^0\.[0-9])0+$/, '$1'),
        ),
      );
      return;
    }
    if (value === '') {
      this.setState({ value: '0' }, () => {
        onChange(0);
      });
    }
  };

  handleOnFocus = () => {
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus();
    }
  };

  handleOnBlur = () => {
    const value = `${this.state.value}`;
    if (Number(value) === 0) {
      this.setState({
        value: '0',
      });
    } else {
      this.setState({
        value: value
          .replace(/\.$/, '')
          .replace(/^0([0-9])/, '$1')
          .replace(/\.0+$/, '')
          .replace(/(^0\.[0-9])0+$/, '$1'),
      });
    }
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const { value } = this.state;
    const props = omit(['value', 'onChange', 'onFocus', 'onBlur'], this.props);
    return (
      <Input
        {...props}
        onChange={this.handleOnChange}
        onFocus={this.handleOnFocus}
        onBlur={this.handleOnBlur}
        value={value}
      />
    );
  }
}

export default InputNumber;
