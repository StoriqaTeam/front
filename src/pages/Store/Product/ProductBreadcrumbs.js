// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { routerShape, withRouter } from 'found';

import { flattenFunc, searchPathByParent, getNameText } from 'utils';

import './ProductBreadcrumbs.scss';

type PropsType = {
  router: routerShape,
  categories: any,
  categoryId: number,
};

class ProductBreadcrumbs extends PureComponent<PropsType> {
  render() {
    const { categories, categoryId, router } = this.props;
    const arr = flattenFunc(categories);
    const pathArr = searchPathByParent(arr, parseInt(categoryId, 10));
    return (
      <div styleName="container">
        <div
          styleName="item"
          onClick={() => router.push('/categories?search=')}
          onKeyDown={() => {}}
          role="button"
          tabIndex="0"
        >
          All categories
        </div>
        {pathArr.length !== 0 &&
          pathArr.map(item => (
            <div key={item.rawId} styleName="item">
              <span styleName="separator">/</span>
              <div
                styleName={classNames('item', {
                  active: item.rawId === parseInt(categoryId, 10),
                })}
                onClick={() =>
                  router.push(`/categories?search=&category=${item.rawId}`)
                }
                onKeyDown={() => {}}
                role="button"
                tabIndex="0"
              >
                {getNameText(item.name, 'EN')}
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default withRouter(ProductBreadcrumbs);
