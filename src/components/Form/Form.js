// @flow

import React, { PureComponent } from 'react';
import type { Node } from 'react';

import './Form.scss';

type PropsType = {
  onSubmit: Function,
  children: Node,
}

class Form extends PureComponent<PropsType> {
  render() {
    return (
      <form styleName="container" noValidate onSubmit={this.props.onSubmit}>
        { this.props.children }
      </form>
    );
  }
}

export default Form;
