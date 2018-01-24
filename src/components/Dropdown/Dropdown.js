// @flow

import React, { Component, Children } from 'react';
import type { Node } from 'react';

import handlerDropdown from './handleDropdownDecorator';

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
        className="Dropdown"
      >
        {Children.map(this.props.children, (child) => {
          if (child.type === 'trigger') {
            return (
              <div
                ref={this.props.triggerRef}
                className="DropdownTrigger"
              >
                {child.props.children}
              </div>
            );
          } else if (child.type === 'content' && this.props.isContentOpen) {
            return (
              <div
                ref={this.props.contentRef}
                className="DropdownContent"
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
