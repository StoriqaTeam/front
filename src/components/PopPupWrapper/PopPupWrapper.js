// @flow

import React, { Component } from 'react';
import type { Node } from 'react';

type PropsType = {
  title: string,
  render: () => Node,
};

class PopPupWrapper extends Component<PropsType> {
  handleClick = () => {};
  render() {
    const { title } = this.props;
    return (
      <aside>
        <h2>{title}</h2>
        <div>{this.props.render()}</div>
      </aside>
    );
  }
}

export default PopPupWrapper;
