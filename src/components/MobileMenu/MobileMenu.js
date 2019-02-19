// @flow

import React, { Component } from 'react';
import { isEmpty } from 'ramda';

import { AppContext } from 'components/App';

import type { TransformedCategoryType } from 'types';

import { SidebarMenu } from './index';

import { buildMobileCategories } from './utils';

import './MobileMenu.scss';

import t from './i18n';

type PropsType = {
  isOpen: boolean,
  onClose: () => void,
};

type StateType = {
  isCategoriesOpen: boolean,
  selectedCategory: TransformedCategoryType,
};

class MobileMenu extends Component<PropsType, StateType> {
  state = {
    isCategoriesOpen: false,
    selectedCategory: {
      name: '',
      children: [],
    },
  };
  handleClick = (evt: any): void => {
    const { onClose } = this.props;
    const { id } = evt.target;
    if (id === 'overlay') {
      this.setState(
        {
          isCategoriesOpen: false,
        },
        () => onClose(),
      );
    }
  };
  handleClose = (): void => {
    this.setState({
      isCategoriesOpen: false,
    });
  };
  handleCategoryClick = (cat: TransformedCategoryType): void => {
    this.setState({
      selectedCategory: cat,
      isCategoriesOpen: !isEmpty(cat.children),
    });
  };
  render() {
    const { isOpen, onClose } = this.props;
    const { isCategoriesOpen, selectedCategory } = this.state;
    return (
      <AppContext.Consumer>
        {({ categories }) => (
          <div
            id="overlay"
            onClick={this.handleClick}
            onKeyPress={() => {}}
            role="presentation"
            styleName={`container ${isOpen ? 'toggled' : ''}`}
          >
            <SidebarMenu
              // $FlowIgnoreMe
              categories={buildMobileCategories(categories)}
              isOpen
              onClick={this.handleCategoryClick}
              onClose={onClose}
              title={t.title}
            />
            <SidebarMenu
              categories={selectedCategory.children}
              isOpen={isCategoriesOpen && isOpen}
              isSecondary
              onClick={this.handleCategoryClick}
              onClose={onClose}
              onCloseCategories={this.handleClose}
              title={selectedCategory.name}
            />
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

export default MobileMenu;
