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
    ['first' | 'mostDiscount']: {
      rawId: number,
      discount: number,
      photoMain: string,
      cashback: number,
      price: number,
    },
  },
};

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
};

class Start extends PureComponent<PropsType> {
  render() {
    const { mainPage } = this.props;
    // $FlowIgnoreMe
    const mostViewedProducts = pathOr([], ['findMostViewedProducts', 'edges'], mainPage);
    // $FlowIgnoreMe
    const mostDiscountProducts = pathOr([], ['findMostDiscountProducts', 'edges'], mainPage);
    // prepare arrays
    const variantsToArr = variantsName =>
      pipe(
        path(['node']),
        i => assoc('storeId', i.rawId, i),
        evolve({
          variants: i => {
            if (variantsName === 'all') {
              return path([variantsName], i);
            }
            return [path([variantsName], i)];
          },
        }),
      );
    const discountProducts = map(
      variantsToArr('mostDiscount'),
      mostDiscountProducts,
    );
    const viewedProducts = map(variantsToArr('first'), mostViewedProducts);
    return (
      <div styleName="container">
        <div styleName="item bannerSliderItem">
          <BannersSlider items={bannersSlider} />
        </div>
        <div styleName="item goodSliderItem">
          {viewedProducts &&
            viewedProducts.length > 0 && (
              <GoodsSlider
                items={viewedProducts}
                title="Most Popular"
                seeAllUrl="/categories?search=&sortBy=VIEWS"
              />
            )}
        </div>
        <div styleName="item goodSliderItem">
          {discountProducts &&
            discountProducts.length > 0 && (
              <GoodsSlider
                items={discountProducts}
                title="Sale"
                seeAllUrl="/categories?search=&sortBy=PRICE_ASC"
              />
            )}
        </div>
        <div styleName="item">
          <BannersRow items={bannersRow} count={2} />
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
      findMostViewedProducts(searchTerm: { options: { attrFilters: [] } }) {
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
      findMostDiscountProducts(searchTerm: { options: { attrFilters: [] } }) {
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
