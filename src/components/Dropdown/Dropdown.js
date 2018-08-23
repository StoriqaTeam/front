// @flow

import React, { Component, Children } from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import handlerDropdown from './handleDropdownDecorator';

import './Dropdown.scss';

type PropsTypes = {
  triggerRef: Function,
  contentRef: Function,
  children: Node,
  isContentOpen: boolean,
  withIcon?: boolean,
  dataTest?: string,
};

class Dropdown extends Component<PropsTypes> {
  render() {
    const { withIcon, isContentOpen, dataTest } = this.props;
    return (
      <div styleName="container">
        {Children.map(this.props.children, child => {
          if (child.type === 'trigger') {
            return (
              <div
                ref={this.props.triggerRef}
                styleName={classNames('trigger', {
                  withIconTrigger: withIcon,
                  isContentOpen,
                })}
                data-test={dataTest || ''}
              >
                {child.props.children}
                {withIcon && (
                  <div styleName="icon">
                    <Icon type="arrowExpand" />
                  </div>
                )}
              </div>
            );
          } else if (child.type === 'content' && isContentOpen) {
            return (
              <div
                ref={this.props.contentRef}
                styleName={classNames('content', {
                  withIconContent: isContentOpen,
                })}
                data-test={dataTest || ''}
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
