import React, { Component } from 'react';

import { Icon } from 'components/Icon';

import './SidebarMenu.scss';

type PropsType = {
  categories: Array<{rawId: number, name: string}>,
  onClose(): void => {},
}

type StateType = {
  selected: ?number,
};

class SidebarMenu extends Component<PropsType, StateType> {
  state = {
    selected: null,
  };
  handleSelected = (selected: number): void => {
    this.setState({ selected });
  };
  render() {
    const { categories, onClose } = this.props;
    const { selected } = this.state;
    return (
      <aside styleName="container">
        <h2 styleName="offscreen">Sidebar Menu</h2>
        <nav>
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
            <h3>Categories</h3>
          </header>
          <ul styleName="menu">
            {categories.map((cat, index) => (
              /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
              <li
                onKeyPress={() => {}}
                key={cat.rawId}
                styleName={`item ${selected === index ? 'active' : ''}`}
                onClick={() => this.handleSelected(index)}
                tabIndex="-1"
              >
                {selected === index ? <span styleName="activeBorder" /> : null}
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
    );
  }
}

export default SidebarMenu;
