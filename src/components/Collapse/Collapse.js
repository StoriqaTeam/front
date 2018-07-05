// @flow

import React, { Component } from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './Collapse.scss';

type PropsType = {
  items: Array<{ id: string, title: string }>,
};

type StateType = {
  title: string,
  isOpen: boolean,
};

class Collapse extends Component<PropsType, StateType> {
  state = {
    title: this.props.items[0].title,
    isOpen: false,
  };
  handleClick = () => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen,
    }));
  };
  render() {
    const { items } = this.props;
    const { isOpen, title } = this.state;
    return (
      <aside styleName="container">
        <h2 styleName="offscreen">Collapsable menu</h2>
        <header
          role="none"
          onKeyPress={() => {}}
          onClick={this.handleClick}
          styleName="header"
        >
          <span>{title}</span>
          <span styleName={classNames('icon', { rotate: isOpen })}>
            <Icon type="arrowExpand" />
          </span>
        </header>
        <nav
          styleName={classNames('content', {
            show: isOpen,
          })}
        >
          <ul>{items.map(item => <li key={item.id}>{item.title}</li>)}</ul>
        </nav>
      </aside>
    );
  }
}

export default Collapse;
