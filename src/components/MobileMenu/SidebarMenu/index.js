// @flow strict

import React, { Component } from 'react';
import { isEmpty, isNil } from 'ramda';
import classNames from 'classnames';
import { Link } from 'found';

import { Icon } from 'components/Icon';
import { categoryViewTracker } from 'rrHalper';

import type { TransformedCategoryType } from 'types';

import './SidebarMenu.scss';

import t from './i18n';

type PropsType = {
  categories: ?Array<TransformedCategoryType>,
  onClose: () => void,
  onCloseCategories?: () => void,
  onClick: TransformedCategoryType => void,
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
        if (!isEmpty(cat.children)) {
          onClick(cat);
        }
      },
    );
  };

  handleClick = (categoryId: number) => {
    if (
      process.env.BROWSER &&
      process.env.REACT_APP_RRPARTNERID &&
      categoryId
    ) {
      categoryViewTracker(parseInt(categoryId, 10));
    }
    this.props.onClose();
  };

  render() {
    const {
      categories,
      onClose,
      onCloseCategories,
      isOpen,
      title,
      isSecondary,
    } = this.props;
    const { selected } = this.state;
    return (
      <aside
        styleName={classNames('container', {
          toggled2: isOpen,
        })}
      >
        <h2 styleName="offscreen">{t.offscreenSidebarMenu}</h2>
        <nav>
          <header styleName="header">
            <span
              id="close"
              onClick={() => {
                if (isSecondary && onCloseCategories) {
                  onCloseCategories();
                } else {
                  onClose();
                }
              }}
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
                  tabIndex="-1"
                >
                  {selected === index ? (
                    <span styleName="activeBorder" />
                  ) : null}
                  <span>
                    {isSecondary ? null : null}
                    <Link
                      styleName="linkName"
                      to={{
                        pathname: '/categories',
                        query: {
                          search: '',
                          category: cat.rawId,
                        },
                      }}
                      onClick={() => {
                        if (cat.rawId) {
                          this.handleClick(cat.rawId);
                        }
                      }}
                      data-test="categoryLink"
                    >
                      {cat.name}
                    </Link>
                  </span>
                  {!isEmpty(cat.children) ? (
                    <button
                      styleName="icon"
                      onClick={() => this.handleSelected(index, cat)}
                    >
                      <Icon type="arrowRight" />
                    </button>
                  ) : null}
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
