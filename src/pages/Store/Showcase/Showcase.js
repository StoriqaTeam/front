// @flow

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { head, isEmpty, map, pathOr } from 'ramda';
import axios from 'axios';

import { log } from 'utils';

import { GoodsSlider } from 'components/GoodsSlider';
import { SearchNoResults } from 'components/SearchNoResults';

import type { Showcase_shop as ShowcaseShopType } from './__generated__/Showcase_shop.graphql';

import './Showcase.scss';

type StateType = {
  priceUsd: ?number,
};

type PropsType = {
  shop: ShowcaseShopType,
};

class Showcase extends Component<PropsType, StateType> {
  state = {
    priceUsd: null,
  };

  componentDidMount() {
    this.isMount = true;
    axios
      .get('https://api.coinmarketcap.com/v1/ticker/storiqa/')
      .then(({ data }) => {
        const dataObj = head(data);
        if (dataObj && this.isMount) {
          this.setState({ priceUsd: Number(dataObj.price_usd) });
        }
      })
      .catch(error => {
        log.debug(error);
      });
  }

  componentWillUnmount() {
    this.isMount = false;
  }

  isMount = false;

  render() {
    const { shop } = this.props;
    const { priceUsd } = this.state;
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
      item => ({ ...item.node, priceUsd }),
      mostDiscountProducts,
    );
    const viewedProducts = map(
      item => ({ ...item.node, priceUsd }),
      mostViewedProducts,
    );
    return (
      <div styleName="container">
        {viewedProducts &&
          !isEmpty(viewedProducts) && (
            <div styleName="item">
              <GoodsSlider items={viewedProducts} title="Most Popular" />
            </div>
          )}
        {discountProducts &&
          !isEmpty(discountProducts) && (
            <div styleName="item">
              <GoodsSlider items={discountProducts} title="Sale" />
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
