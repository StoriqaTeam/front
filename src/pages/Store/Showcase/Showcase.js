// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { isEmpty, map, pathOr } from 'ramda';

import { SearchNoResults } from 'components/SearchNoResults';
import Goods from 'pages/Start/Goods';

import type { Showcase_shop as ShowcaseShopType } from './__generated__/Showcase_shop.graphql';

import './Showcase.scss';

import t from './i18n';

type PropsType = {
  shop: ShowcaseShopType,
};

class Showcase extends PureComponent<PropsType> {
  render() {
    const { shop } = this.props;
    // $FlowIgnoreMe
    const mostViewedProducts = pathOr(
      [],
      ['findMostViewedProducts', 'edges'],
      shop,
    );
    // $FlowIgnoreMe
    const mostDiscountProducts = pathOr(
      [],
      ['findMostDiscountProducts', 'edges'],
      shop,
    );
    const discountProducts = map(
      item => ({ ...item.node }),
      mostDiscountProducts,
    );
    const viewedProducts = map(item => ({ ...item.node }), mostViewedProducts);
    return (
      <div styleName="container">
        {viewedProducts &&
          !isEmpty(viewedProducts) && (
            <div styleName="item">
              <Goods items={viewedProducts} title={t.mostPopular} />
            </div>
          )}
        {discountProducts &&
          !isEmpty(discountProducts) && (
            <div styleName="item">
              <Goods items={discountProducts} title={t.sale} />
            </div>
          )}
        {isEmpty(viewedProducts) &&
          isEmpty(discountProducts) && <SearchNoResults />}
      </div>
    );
  }
}

export default createFragmentContainer(
  Showcase,
  graphql`
    fragment Showcase_shop on Store {
      findMostViewedProducts(
        searchTerm: { options: { attrFilters: [] } }
        first: 30
      ) {
        edges {
          node {
            rawId
            storeId
            name {
              lang
              text
            }
            store {
              name {
                lang
                text
              }
            }
            currency
            products(first: 1) {
              edges {
                node {
                  id
                  rawId
                  discount
                  photoMain
                  cashback
                  price
                  customerPrice {
                    price
                    currency
                  }
                }
              }
            }
            rating
          }
        }
      }
      findMostDiscountProducts(
        searchTerm: { options: { attrFilters: [] } }
        first: 30
      ) {
        edges {
          node {
            rawId
            storeId
            name {
              lang
              text
            }
            store {
              name {
                lang
                text
              }
            }
            currency
            products(first: 1) {
              edges {
                node {
                  id
                  rawId
                  discount
                  photoMain
                  cashback
                  price
                  customerPrice {
                    price
                    currency
                  }
                }
              }
            }
            rating
          }
        }
      }
    }
  `,
);
