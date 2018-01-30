// @flow

import React, { Component, Children } from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import handlerDropdown from './handleDropdownDecorator';

import './Dropdown.scss';

type PropsTypes = {
  triggerRef: Function,
  contentRef: Function,
  children: Node,
  isContentOpen: boolean,
  round: boolean | void
};

class Dropdown extends Component<PropsTypes> {
  render() {
    const { round } = this.props;

    return (
      <div
        styleName="container"
      >
        {Children.map(this.props.children, (child) => {
          if (child.type === 'trigger') {
            return (
              <div
                ref={this.props.triggerRef}
                styleName={classNames('trigger', { round })}
              >
                {child.props.children}
              </div>
            );
          } else if (child.type === 'content' && this.props.isContentOpen) {
            return (
              <div
                ref={this.props.contentRef}
                styleName="content"
              >
                {child.props.children}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }
}

export default handlerDropdown(Dropdown);
