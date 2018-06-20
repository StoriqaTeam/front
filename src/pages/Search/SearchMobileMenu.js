// @flow

import React, { Component } from 'react';

import './SearchMobileMenu.scss';

type PropsType = {
  isOpen: boolean,
  onClose: () => void,
  children: any,
};

class SearchMobileMenu extends Component<PropsType> {
  handleClick = (evt: any): void => {
    const { onClose } = this.props;
    const { id } = evt.target;
    if (id === 'overlay') {
      onClose()
    }
  };
  render() {
    const { isOpen } = this.props;
    return (
      <div
        id="overlay"
        onClick={this.handleClick}
        onKeyPress={() => {}}
        role="presentation"
        styleName={`container ${isOpen ? 'toggled' : ''}`}
      >
        {this.props.children}
      </div>
    );
  }
}

export default SearchMobileMenu;
