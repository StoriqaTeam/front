// @flow

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { find, propEq } from 'ramda';
import { Link, withRouter } from 'found';

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
  }>,
};

class CategoriesMenu extends Component<PropsType> {
  renderMenu(categories: any, isRoot: ?boolean) {
    const lang = 'EN';
    return categories.map(category => {
      const { rawId } = category;
      const categoryChildren = category.children;
      const name = find(propEq('lang', lang))(category.name);
      const renderInnerLink = () => (
        <Fragment>
          <span styleName="text">{name.text}</span>
          {categoryChildren &&
            !isRoot && (
              <span styleName="icon">
                <Icon type="arrowRight" />
              </span>
            )}
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
          <Link
            styleName="link"
            to={{
              pathname: '/categories',
              query: {
                search: '',
                category: rawId,
              },
            }}
            data-test="categorieLink"
          >
            {renderInnerLink()}
          </Link>
          {categoryChildren && (
            <div styleName="items">
              <div styleName="itemsWrap">
                <div styleName="title">{name.text}</div>
                <ul>{this.renderMenu(categoryChildren)}</ul>
              </div>
            </div>
          )}
        </li>
      );
    });
  }

  render() {
    return (
      <div styleName="container">
        <div styleName="rootItem rootButtonItem">
          <Link styleName="button" to="/" data-test="allCategoriesLink">
            <Icon inline type="cats" size="24" />
            <span styleName="buttonText">All</span>
          </Link>
        </div>
        <ul styleName="root">{this.renderMenu(this.props.categories, true)}</ul>
      </div>
    );
  }
}

export default withRouter(CategoriesMenu);
