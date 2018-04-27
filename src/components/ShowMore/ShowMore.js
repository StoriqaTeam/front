// @flow

import React, { Component } from 'react';

type PropsType = {
  children?: any,
}

type StateType = {
  on: boolean,
}

class ShowMore extends Component<PropsType, StateType> {
  state = {
    on: false,
  }

  render() {
    return (
      <div>
        <div>Show more</div>
        {this.state.on && this.props.children}
      </div>
    );
  }
}

export default ShowMore;
