// @flow

import React, { Component } from 'react';

import { AppContext } from 'components/App';

import { SidebarMenu } from './index';

import { buildMobileCategories } from './utils';

import './MobileMenu.scss';

type PropsType = {
  isOpen: boolean,
  onClose: () => void,
};

class MobileMenu extends Component<PropsType> {
  handleClick = (evt: any): void => {
    const { onClose } = this.props;
    const { id } = evt.target;
    if (id === 'overlay') {
      onClose();
    }
  };
  render() {
    const { isOpen, onClose } = this.props;
    return (
      <AppContext.Consumer>
        {({ categories }) => (
          <div
            id="overlay"
            onKeyPress={() => {}}
            role="presentation"
            onClick={this.handleClick}
            styleName={`container ${isOpen ? 'toggled' : ''}`}
          >
            <SidebarMenu
              categories={buildMobileCategories(categories)}
              onClose={onClose}
            />
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

export default MobileMenu;
