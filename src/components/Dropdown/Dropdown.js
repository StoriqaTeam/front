// @flow

import React, { Component, Children } from 'react';
import type { Node } from 'react';

import handlerDropdown from './handleDropdownDecorator';

import './Dropdown.scss';

type PropsTypes = {
  triggerRef: Function,
  contentRef: Function,
  children: Node,
  isContentOpen: boolean,
};

class Dropdown extends Component<PropsTypes> {
  render() {
    return (
      <div
        styleName="container"
      >
        {Children.map(this.props.children, (child) => {
          if (child.type === 'trigger') {
            return (
              <div
                ref={this.props.triggerRef}
                styleName="trigger"
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
          } else { // eslint-disable-line
            return null;
          }
        })}
      </div>
    );
  }
}

export default handlerDropdown(Dropdown);
