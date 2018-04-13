// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr } from 'ramda';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { BannersSlider } from 'components/BannersSlider';
import { BannersRow } from 'components/BannersRow';
import { GoodsSlider } from 'components/GoodsSlider';

import './Start.scss';

import bannersSlider from './bannersSlider.json';
import bannersRow from './bannersRow.json';
// import mostPopularGoods from './mostPopularGoods.json';

class Start extends PureComponent<{}> {// eslint-disable-line
  render() {
    const mostViewedProducts = pathOr([], [
      'mainPage',
      'findMostViewedProducts',
      'edges',
    ], this.props);
    const mostDiscountProducts = pathOr([], [
      'mainPage',
      'findMostDiscountProducts',
      'edges',
    ], this.props);
    return (
      <div styleName="container">
        <div styleName="item">
          <BannersSlider items={bannersSlider} />
        </div>
        {mostViewedProducts && mostViewedProducts.length > 0 &&
          <div styleName="item">
            <GoodsSlider
              items={mostViewedProducts}
              title="Популярное"
            />
          </div>
        }
        {mostDiscountProducts && mostDiscountProducts.length > 0 &&
          <div styleName="item">
            <GoodsSlider
              items={mostDiscountProducts}
              title="Распродажа"
            />
          </div>
        }
        <div styleName="item">
          <BannersRow
            items={bannersRow}
            count={2}
          />
        </div>
      </div>
    );
  }
}

Start.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
  currentUser: currentUserShape,
};

export default createFragmentContainer(
  Page(Start),
  graphql`
    fragment Start_mainPage on MainPage {
      findMostViewedProducts(searchTerm: {options: {attrFilters: []}}) {
        edges {
          node {
            id
            rawId
            store {
              id
              rawId
            }
            name {
              lang
              text
            }
            currencyId
            variants {
              first {
                id
                rawId
                discount
                photoMain
                cashback
                price
              }
            }
          }
        }
      }
      findMostDiscountProducts(searchTerm: {options: {attrFilters: []}}) {
        edges {
          node {
            id
            rawId
            store {
              id
              rawId
            }
            name {
              lang
              text
            }
            currencyId
            variants {
              mostDiscount {
                id
                rawId
                discount
                photoMain
                cashback
                price
              }
            }
          }
        }
      }
    }
  `,
);
