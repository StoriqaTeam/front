// @flow

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { find, propEq } from 'ramda';
import { Link } from 'found';

import { Icon } from 'components/Icon';

import './CategoriesMenu.scss';

type PropsType = {
  categories: Array<{
    rawId: string,
    name: Array<{
      lang: string,
      text: string,
    }>,
    children?: Array<any>,
  }>
}

class CategoriesMenu extends Component<PropsType> {
  renderMenu(categories: any, isRoot: ?boolean) {
    const lang = 'EN';
    return categories.map((category) => {
      const categoryChildren = category.children;
      const name = find(propEq('lang', lang))(category.name);
      const renderInnerLink = () => (
        <Fragment>
          <span styleName="text">{name.text}</span>
          {categoryChildren && !isRoot &&
            <span styleName="icon">
              <Icon type="arrowRight" />
            </span>
          }
        </Fragment>
      );
      return (
        <li
          key={category.rawId}
          styleName={classNames({
            rootItem: isRoot,
            midItem: !isRoot && categoryChildren,
          })}
        >
          <a
            href="/"
            styleName="link"
          >
            {renderInnerLink()}
          </a>
          {categoryChildren &&
            <div styleName="items">
              <div styleName="itemsWrap">
                <div styleName="title">{name.text}</div>
                <ul>
                  {this.renderMenu(categoryChildren)}
                </ul>
              </div>
            </div>
          }
        </li>
      );
    });
  }

  render() {
    return (
      <div styleName="container">
        <ul styleName="root">
          <li styleName="rootItem rootButtonItem">
            <Link
              styleName="button"
              to="/"
            >
              <Icon
                inline
                type="cats"
                size="24"
              />
              <span styleName="buttonText">All</span>
            </Link>
          </li>
          { this.renderMenu(this.props.categories, true) }
        </ul>
      </div>
    );
  }
}

export default CategoriesMenu;
