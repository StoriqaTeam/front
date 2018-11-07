// @flow

import React, { Component } from 'react';
import cn from 'classnames';

import { Icon } from 'components/Icon';

import './ShowMore.scss';

import t from './i18n';

type PropsType = {
  height?: ?number, // max container height in rem (needed for animation)
  children?: any,
  dataTest?: string,
  isOpen?: boolean,
};

type StateType = {
  on: boolean,
};

class ShowMore extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      on: props.isOpen || false,
    };
  }

  handleClick() {
    this.setState({ on: !this.state.on });
  }

  render() {
    const title = this.state.on ? t.showLess : t.showMore;
    const height = this.state.on ? this.props.height || 25 : 0;
    return (
      <div>
        <button
          styleName="header"
          onClick={() => this.handleClick()}
          data-test={this.props.dataTest}
        >
          <div styleName="icon">
            <div styleName={cn({ on: this.state.on, off: !this.state.on })}>
              <Icon type="arrowExpand" size={16} inline />
            </div>
          </div>
          <div styleName="text">{title}</div>
        </button>
        <div
          styleName="content"
          style={{
            maxHeight: `${height}rem`,
            overflow: this.state.on ? 'unset' : 'hidden',
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default ShowMore;
