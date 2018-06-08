import React, { Component } from 'react';

import { Icon } from 'components/Icon';

import './MobileMenu.scss';

type PropsTypes = {
  isOpen: boolean,
  onClose(): void => {}
}

class MobileMenu extends Component<PropsTypes> {
  handleClick = () => {};
  render() {
    const { isOpen, onClose } = this.props;
    return(
      <section
        onKeyPress={() => {}}
        role="presentation"
        onClick={onClose}
        styleName={`container ${isOpen ? 'toggled' : ''}`}
      >
        <aside styleName="menu">
          <nav>
            <header styleName="title">
              <span
                onClick={onClose}
                onKeyPress={() => {}}
                role="button"
                styleName="close"
                tabIndex="-1"
              >
                <Icon type="cross" size={24} />
              </span>
              <h3>Categories</h3>
            </header>
          </nav>
        </aside>
      </section>
    );
  }
}

export default MobileMenu;
