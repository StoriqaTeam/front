import React, { Component } from 'react';

import { Icon } from 'components/Icon';

import { AppContext } from './index';
import { buildMobileCategories } from './utils';

import './MobileMenu.scss';

type PropsTypes = {
  isOpen: boolean,
  onClose(): void => {},
};

class MobileMenu extends Component<PropsTypes> {
  handleClick = evt => {
    const { onClose } = this.props;
    const { tagName } = evt.target;
    if (tagName === 'svg' || tagName === 'path' || tagName === 'SECTION') {
      onClose();
    }
  };
  render() {
    const { isOpen } = this.props;
    const Header = () => (
      <header styleName="title">
        <span
          id="close"
          onClick={this.handleClick}
          onKeyPress={() => {}}
          role="button"
          styleName="close"
          tabIndex="-1"
        >
          <Icon type="cross" size={24} />
        </span>
        <h3>Categories</h3>
      </header>
    );
    return (
      <AppContext.Consumer>
        {({ categories }) => (
          <section
            id="overlay"
            onKeyPress={() => {}}
            role="presentation"
            onClick={this.handleClick}
            styleName={`container ${isOpen ? 'toggled' : ''}`}
          >
            <aside styleName="sidebar">
              <nav>
                <Header />
                <ul styleName="menu">
                  {/* <pre>{JSON.stringify(buildMobileCategories(categories), null, 2)}</pre> */}
                  {buildMobileCategories(categories).map(cat => (
                    <li
                      key={cat.rawId}
                      styleName="item"
                    >
                      <span>
                        <Icon type="qualityAssurance" />
                        <p styleName="linkName">
                          {cat.name}
                        </p>
                      </span>
                      <Icon type="arrowRight" />
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </section>
        )}
      </AppContext.Consumer>
    );
  }
}

export default MobileMenu;
