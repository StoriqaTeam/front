// @flow

import React, { Component } from 'react';
import type { Node } from 'react';

import './PopUpWrapper.scss';

type PropsType = {
  title: string,
  render: () => Node,
};

class PopUpWrapper extends Component<PropsType> {
  handleClick = () => {};
  render() {
    const { title } = this.props;
    return (
      <aside styleName="container">
        <h2 styleName="title"><strong>{title}</strong></h2>
        <div>{this.props.render()}</div>
      </aside>
    );
  }
}

export default PopUpWrapper;
