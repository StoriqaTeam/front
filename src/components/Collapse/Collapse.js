// @flow

import React, { Component } from 'react';
import { remove, isNil, findIndex, propEq, isEmpty } from 'ramda';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './Collapse.scss';

type ItemType = {
  id: string,
  title: string,
  link?: string,
  links?: Array<{ id: string, name: string }>,
};

type PropsType = {
  items: Array<ItemType>,
  onSelected: (item: { id: string, title: string }) => void,
  isDisabled: boolean,
  // eslint-disable-next-line
  selected: string,
  transparent: boolean,
  grouped?: boolean,
  menuTitle?: string,
};

type StateType = {
  isOpen: boolean,
  index: number,
  title: ?string,
};

class Collapse extends Component<PropsType, StateType> {
  static defaultProps = {
    isDisabled: false,
    menuTitle: '',
    selected: '',
    transparent: false,
    grouped: false,
  };
  static getDerivedStateFromProps(
    nextProps: PropsType,
    nextState: StateType,
  ): StateType | null {
    const { selected, items } = nextProps;
    const index =
      !isNil(selected) && !isEmpty(selected)
        ? findIndex(propEq('id', selected))(items)
        : 0;
    return {
      ...nextState,
      index,
      isOpen: false,
      title: null,
    };
  }
  handleClick = (): void => {
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
  renderGroupedItems = (items: Array<ItemType>) => (
    <ul>
      {items.map((item, idx) => (
        <li
          key={item.id}
          onClick={() => this.handleSelected(item, idx)}
          onKeyPress={() => {}}
          role="none"
          styleName="item"
        >
          <span styleName="itemTitle">{item.title}</span>
          <ul>
            {/* $FlowIgnoreMe */}
            {item.links.map(link => <li key={link.id}>{link.name}</li>)}
          </ul>
        </li>
      ))}
    </ul>
  );
  renderTitle = (): string => {
    const { menuTitle, items } = this.props;
    const { title, index } = this.state;
    if (!isNil(menuTitle) && !isEmpty(menuTitle)) {
      return menuTitle;
    }
    return isNil(title) ? items[index].title : title;
  };
  render() {
    const { items, transparent, grouped } = this.props;
    const { isOpen, index } = this.state;
    return (
      <div styleName={classNames('container', { transparent })}>
        <header
          role="none"
          onKeyPress={() => {}}
          onClick={this.handleClick}
          styleName="header"
        >
          <span>{this.renderTitle()}</span>
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
          {grouped ? (
            this.renderGroupedItems(items)
          ) : (
            <ul>
              {remove(index, 1, items).map((item, idx) => (
                <li
                  key={item.id}
                  onClick={() => this.handleSelected(item, idx)}
                  onKeyPress={() => {}}
                  role="none"
                  styleName="item"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          )}
        </nav>
      </div>
    );
  }
}

export default Collapse;
