// @flow

import React, { Component } from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './MobileSidebar.scss';

type PropsType = {
  isOpen: boolean,
  onClose: () => void,
  children: any,
  left: boolean,
  title: string,
};

class MobileSidebar extends Component<PropsType> {
  static defaultProps = {
    left: false,
    title: '',
  }
  handleClick = (evt: any): void => {
    const { onClose } = this.props;
    const { id } = evt.target;
    if (id === 'overlay') {
      onClose();
    }
  };
  render() {
    const { isOpen, left, onClose, title } = this.props;
    return (
      <div
        id="overlay"
        onClick={this.handleClick}
        onKeyPress={() => {}}
        role="presentation"
        styleName={`container ${isOpen ? 'toggled' : ''}`}
      >
        <aside
          styleName={classNames('sidebar', {
            left,
            toggled: isOpen
          })}
        >
          <header styleName="header">
            <span
              id="close"
              onClick={onClose}
              onKeyPress={() => {}}
              role="button"
              styleName="close"
              tabIndex="-1"
            >
              <Icon type="cross" size={24} />
            </span>
            <h3>{title}</h3>
          </header>
          {this.props.children}
        </aside>
      </div>
    )
  }
}

export default MobileSidebar;
