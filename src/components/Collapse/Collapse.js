// @flow strict

import React, { Component } from 'react';
import { remove, isNil, findIndex, propEq, isEmpty } from 'ramda';
import classNames from 'classnames';
import { routerShape, withRouter } from 'found';

import { Icon } from 'components/Icon';

import type { CollapseItemType } from 'types';

import './Collapse.scss';

type PropsType = {
  items: Array<CollapseItemType>,
  onSelected: CollapseItemType => void,
  isDisabled: boolean,
  // eslint-disable-next-line
  selected: ?string | ?number,
  transparent: boolean,
  grouped: boolean,
  menuTitle?: string,
  router: routerShape,
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
      !isNil(selected) && !isEmpty(`${selected}`)
        ? findIndex(propEq('id', selected))(items)
        : 0;
    return {
      ...nextState,
      index,
      isOpen: false,
      title: null,
    };
  }

  state = {
    isOpen: false,
    index: 0,
    title: null,
  };

  handleClick = (): void => {
    const { isDisabled } = this.props;
    if (!isDisabled) {
      this.setState(({ isOpen }) => ({
        isOpen: !isOpen,
      }));
    }
  };

  handleSelected = (item: CollapseItemType, index: number): void => {
    const { onSelected } = this.props;
    this.setState(
      {
        index,
        title: item.title,
      },
      () => {
        onSelected(item);
      },
    );
  };

  renderGroupedItems = (items: Array<CollapseItemType>) => (
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
            {!isNil(item.links) &&
              item.links.map(({ id, name, appLink, pdfLink, link }) => (
                <li key={id}>
                  {appLink != null && (
                    <button
                      styleName="navItem"
                      onClick={() => {
                        this.props.router.push(appLink);
                      }}
                    >
                      {name}
                    </button>
                  )}
                  {pdfLink != null && (
                    <a href={pdfLink} target="_blank" styleName="navItem">
                      {name}
                    </a>
                  )}
                  {link != null && (
                    <a href={link} target="_blank" styleName="navItem">
                      {name}
                    </a>
                  )}
                </li>
              ))}
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

export default withRouter(Collapse);
