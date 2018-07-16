// @flow

import React, { Component } from 'react';
import { remove, isNil } from 'ramda';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './Collapse.scss';

type PropsType = {
  items: Array<{ id: string, title: string }>,
  onSelected: (item: { id: string, title: string }) => void,
  isDisabled: boolean,
};

type StateType = {
  isOpen: boolean,
  index: number,
  title: ?string,
};

class Collapse extends Component<PropsType, StateType> {
  static defaultProps = {
    isDisabled:  false,
  };
  state = {
    isOpen: false,
    index: 0,
    title: null,
  };
  handleClick = () => {
    const { isDisabled } = this.props;
    if (!isDisabled) {
      this.setState(({ isOpen }) => ({
        isOpen: !isOpen,
      }));
    }
  };
  handleSelected = (
    item: { id: string, title: string },
    index: number,
  ): void => {
    const { onSelected } = this.props;
    this.setState(
      {
        index,
        isOpen: false,
        title: item.title,
      },
      () => {
        onSelected(item);
      },
    );
  };
  render() {
    const { items } = this.props;
    const { isOpen, index, title } = this.state;
    return (
      <div styleName="container">
        <header
          role="none"
          onKeyPress={() => {}}
          onClick={this.handleClick}
          styleName="header"
        >
          <span>{isNil(title) ? items[index].title : title}</span>
          <span styleName={classNames('icon', { rotate: isOpen })}>
            <Icon type="arrowExpand" />
          </span>
        </header>
        <nav
          styleName={classNames('content', {
            show: isOpen,
          })}
        >
          <h3 styleName="offscreen">Collapsable menu</h3>
          <ul>
            {remove(index, 1, items).map((item, idx) => (
              <li
                key={item.id}
                onClick={() => this.handleSelected(item, idx)}
                onKeyPress={() => {}}
                role="none"
              >
                {item.title}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }
}

export default Collapse;
