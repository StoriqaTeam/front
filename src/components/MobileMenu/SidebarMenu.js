// @flow

import React, { Component } from 'react';
import { isEmpty, isNil } from 'ramda';
import classNames from 'classnames';
import { Link } from 'found';

import { Icon } from 'components/Icon';

import type { TransformedCategoryType } from './types';

import './SidebarMenu.scss';

type PropsType = {
  categories: ?Array<TransformedCategoryType>,
  onClose: () => void,
  onClick: any => any,
  isOpen: boolean,
  isSecondary: boolean,
  title: string,
};

type StateType = {
  selected: ?number,
};

class SidebarMenu extends Component<PropsType, StateType> {
  static defaultProps = {
    isSecondary: false,
  };
  state = {
    selected: null,
  };
  handleSelected = (selected: number, cat: TransformedCategoryType): void => {
    const { onClick } = this.props;
    this.setState(
      {
        selected,
      },
      () => {
        onClick(cat);
      },
    );
  };
  render() {
    const { categories, onClose, isOpen, title, isSecondary } = this.props;
    const { selected } = this.state;
    return (
      <aside
        styleName={classNames('container', {
          toggled2: isOpen,
        })}
      >
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
              <Icon type={isSecondary ? 'arrowLeft' : 'cross'} size={24} />
            </span>
            <h3>{title}</h3>
          </header>
          {isNil(categories) || isEmpty(categories) ? null : (
            <ul styleName="menu">
              {categories.map((cat, index) => (
                /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
                <li
                  onKeyPress={() => {}}
                  key={cat.rawId}
                  styleName={`item ${selected === index ? 'active' : ''}`}
                  onClick={() => this.handleSelected(index, cat)}
                  tabIndex="-1"
                >
                  {selected === index ? (
                    <span styleName="activeBorder" />
                  ) : null}
                  <span>
                    {isSecondary ? null : <Icon type="qualityAssurance" />}
                    <Link
                      styleName="linkName"
                      to={{
                        pathname: '/categories',
                        query: {
                          search: '',
                          category: cat.rawId,
                        },
                      }}
                      data-test="categoryLink"
                    >
                      {cat.name}
                    </Link>
                  </span>
                  <Icon type="arrowRight" />
                </li>
              ))}
            </ul>
          )}
        </nav>
      </aside>
    );
  }
}

export default SidebarMenu;
