// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, path, map, pipe, evolve, assoc } from 'ramda';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { BannersSlider } from 'components/BannersSlider';
import { BannersRow } from 'components/BannersRow';
import { GoodsSlider } from 'components/GoodsSlider';

import SliderPlaceholder from './SliderPlaceholder';

import './Start.scss';

import bannersSlider from './bannersSlider.json';
import bannersRow from './bannersRow.json';

type ProductType = {
  rawId: number,
  store: {
    rawId: number,
  },
  name: Array<{
    lang: string,
    text: string,
  }>,
  currencyId: number,
  variants: {
    first: {
      rawId: number,
      discount: number,
      photoMain: string,
      cashback: number,
      price: number,
    },
  },
}

/* eslint-disable */
type PropsType = {
  mainPage: {
    findMostViewedProducts: ?{
      edges: Array<{
        node: ProductType,
      }>,
    },
    findMostDiscountProducts: ?{
      edges: Array<{
        node: ProductType,
      }>,
    },
  },
}
/* eslint-enable */

class Start extends PureComponent<PropsType> {
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
    // prepare arrays
    const variantsToArr = variantsName => pipe(
      path(['node']),
      i => assoc('storeId', i.rawId, i),
      evolve({
        variants: (i) => {
          if (variantsName === 'all') {
            return path([variantsName], i);
          }
          return [path([variantsName], i)];
        },
      }),
    );
    const discountProducts = map(variantsToArr('mostDiscount'), mostDiscountProducts);
    const viewedProducts = map(variantsToArr('first'), mostViewedProducts);
    return (
      <div styleName="container">
        <div styleName="item bannerSliderItem">
          <BannersSlider items={bannersSlider} />
        </div>
        <div styleName="item goodSliderItem">
          {viewedProducts && viewedProducts.length > 0 &&
            <GoodsSlider
              items={viewedProducts}
              title="Most Popular"
            />
          }
        </div>
        <div styleName="item goodSliderItem">
          {discountProducts && discountProducts.length > 0 &&
            <GoodsSlider
              items={discountProducts}
              title="Sale"
            />
          }
        </div>
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
  showAlert: PropTypes.func,
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
            rawId
            store {
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
            rawId
            store {
              rawId
            }
            name {
              lang
              text
            }
            currencyId
            variants {
              mostDiscount {
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
