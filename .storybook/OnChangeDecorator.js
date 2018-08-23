// @flow

import React, { Component, Children, cloneElement } from 'react';

type PropsType = {
  children: any,
};

type StateType = {
  value: string,
};

class OnChangeDecorator extends Component<PropsType, StateType> {
  state = {
    value: '',
  }

  onChange = (value: string) => {
    this.setState({ value });
  }

  render() {
    const { children } = this.props;
    const { value } = this.state;
    const childrenWithProps = Children.map(children, child =>
      cloneElement(child, { value, onChange: this.onChange }));

    return (<div>{childrenWithProps}</div>);
  }
}

export default OnChangeDecorator;
