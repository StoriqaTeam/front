// @flow

import React, { Component } from 'react';
import cn from 'classnames';

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
    this.setState({ on: !this.state.on });
  }

  render() {
    const title = this.state.on ? 'Show less' : 'Show more';
    return (
      <div>
        <button
          styleName="header"
          onClick={() => this.handleClick()}
        >
          <div styleName="icon">
            <div styleName={cn({ on: this.state.on, off: !this.state.on })}>
              <Icon type="arrowExpand" size={16} inline />
            </div>
          </div>
          <div styleName="text">
            {title}
          </div>
        </button>
        {this.state.on ? this.props.children : null}
      </div>
    );
  }
}

export default ShowMore;
