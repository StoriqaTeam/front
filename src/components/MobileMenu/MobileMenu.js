import React, { Component } from 'react';

import { Icon } from 'components/Icon';

import { AppContext } from 'components/App';

import { buildMobileCategories } from './utils';

import './MobileMenu.scss';

type PropsType = {
  isOpen: boolean,
  onClose(): void => {},
};

type StateType = {
  selected: ?number,
};

class MobileMenu extends Component<PropsType, StateType> {
  state = {
    selected: null,
  };
  handleClick = (evt): void => {
    const { onClose } = this.props;
    const { tagName } = evt.target;
    if (tagName === 'svg' || tagName === 'path' || tagName === 'SECTION') {
      onClose();
    }
  };
  handleSelected = (selected: number): void => {
    this.setState({ selected });
  };
  render() {
    const { isOpen } = this.props;
    const { selected } = this.state;
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
          <div
            id="overlay"
            onKeyPress={() => {}}
            role="presentation"
            onClick={this.handleClick}
            styleName={`container ${isOpen ? 'toggled' : ''}`}
          >
            <aside styleName="sidebar">
              <h2 styleName="offscreen">Sidebar Menu</h2>
              <nav>
                <Header />
                <ul styleName="menu">
                  {buildMobileCategories(categories).map((cat, index) => (
                    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
                    <li
                      onKeyPress={() => {}}
                      key={cat.rawId}
                      styleName={`item ${selected === index ? 'active' : ''}`}
                      onClick={() => this.handleSelected(index)}
                      tabIndex="-1"
                    >
                      {selected === index ? (
                        <span styleName="activeBorder" />
                      ) : null}
                      <span>
                        <Icon type="qualityAssurance" />
                        <p styleName="linkName">{cat.name}</p>
                      </span>
                      <Icon type="arrowRight" />
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

export default MobileMenu;
