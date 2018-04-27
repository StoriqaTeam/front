// @flow

import React, { Component } from 'react';

import { Icon } from 'components/Icon';

import './ShowMore.scss';

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

  handleClick() {
    console.log("TOTOTO");
  }

  render() {
    return (
      <div>
        <div styleName="header" onClick={(e) => this.handleClick(e)}>
          <div styleName="icon">
            <Icon type="arrowExpand" size={16} inline />
          </div>
          <div styleName="text">
            Show more
          </div>
        </div>
        {this.state.on ? this.props.children : null}
      </div>
    );
  }
}

export default ShowMore;
