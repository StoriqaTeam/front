// @flow

import React, { Component } from 'react';
import { map, pathOr, isEmpty } from 'ramda';
import classNames from 'classnames';
import { withRouter, routerShape } from 'found';
import { Relay } from 'react-relay';

import { flattenFunc, getNameText, searchPathByParent } from 'utils';
import { categoryViewTracker } from 'rrHalper';
import { Button } from 'components/common/Button';
import { CardProduct } from 'components/CardProduct';
import { Icon } from 'components/Icon';
import { SearchNoResults } from 'components/SearchNoResults';

import type { Categories_search as CategoriesSearch } from './Categories/__generated__/Categories_search.graphql';

import './SearchContent.scss';

import t from './i18n';

type PropsType = {
  router: routerShape,
  relay: Relay,
  // eslint-disable-next-line
  search: CategoriesSearch,
  productsPerRequest: number,
  onFilterMenu: () => void,
};

class SearchContent extends Component<PropsType> {
  productsRefetch = (): void => {
    const { relay, productsPerRequest } = this.props;
    relay.loadMore(productsPerRequest);
  };
  renderBreadcrumbs = () => {
    const { router } = this.props;
    // $FlowIgnoreMe
    const categoryId = pathOr(
      null,
      ['match', 'location', 'query', 'category'],
      this.props,
    );
    // $FlowIgnoreMe
    const categories = pathOr(
      null,
      [
        'search',
        'findProduct',
        'pageInfo',
        'searchFilters',
        'categories',
        'children',
      ],
      this.props,
    );
    if (!categories || !categoryId) {
      return (
        <div styleName="breadcrumbs">
          <div
            styleName="item"
            onClick={() => router.push('/categories?search=')}
            onKeyDown={() => {}}
            role="button"
            tabIndex="0"
          >
            {t.allCategories}
          </div>
        </div>
      );
    }
    const arr = flattenFunc(categories);
    const pathArr = searchPathByParent(arr, parseInt(categoryId, 10));
    return (
      <div styleName="breadcrumbs">
        <div
          styleName="item"
          onClick={() => router.push('/categories?search=')}
          onKeyDown={() => {}}
          role="button"
          tabIndex="0"
        >
          {t.allCategories}
        </div>
        {pathArr.length !== 0 &&
          pathArr.map(item => (
            <div key={item.rawId} styleName="item">
              <span styleName="separator">/</span>
              <div
                styleName={classNames('item', {
                  active: item.rawId === parseInt(categoryId, 10),
                })}
                onClick={() => {
                  router.push(`/categories?search=&category=${item.rawId}`);
                  categoryViewTracker(parseInt(item.rawId, 10));
                }}
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
  };
  render() {
    const { relay, onFilterMenu } = this.props;
    // $FlowIgnoreMe
    const products = pathOr([], ['search', 'findProduct', 'edges'], this.props);
    const productsWithVariants = map(item => item.node, products);
    return (
      <div styleName="container">
        <div styleName="topContentContainer">
          {this.renderBreadcrumbs()}
          <span
            onClick={onFilterMenu}
            onKeyPress={() => {}}
            role="button"
            styleName="filtersButton"
            tabIndex="-1"
          >
            <Icon type="controls" />
            <span>{t.filters}</span>
          </span>
        </div>
        <div styleName="productsContainer">
          {!isEmpty(productsWithVariants) ? (
            map(
              item => (
                <div key={item.id} styleName="cardWrapper">
                  <CardProduct item={{ ...item }} isSearchPage />
                </div>
              ),
              productsWithVariants,
            )
          ) : (
            <SearchNoResults />
          )}
        </div>
        {relay.hasMore() && (
          <div styleName="button">
            <Button
              big
              load
              onClick={this.productsRefetch}
              dataTest="searchProductLoadMoreButton"
              wireframe
            >
              {t.loadMore}
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(SearchContent);
