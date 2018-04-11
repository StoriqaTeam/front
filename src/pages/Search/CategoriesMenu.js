// @flow

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { find, propEq } from 'ramda';

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
          <div styleName="text">{name.text}</div>
          {categoryChildren && !isRoot &&
          <div styleName="icon">
            <Icon type="arrowRight" />
          </div>
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
          {categoryChildren ?
            <div styleName="link">
              {renderInnerLink()}
            </div> :
            <a
              href="/"
              styleName="link"
            >
              {renderInnerLink()}
            </a>}
          {categoryChildren &&
            <div styleName="itemsWrap">
              <ul>
                {this.renderMenu(categoryChildren)}
              </ul>
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
          { this.renderMenu(this.props.categories, true) }
        </ul>
      </div>
    );
  }
}

export default CategoriesMenu;
