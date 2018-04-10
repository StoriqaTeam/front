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

import CategoriesMenu from './CategoriesMenu';

import './Start.scss';

import bannersSlider from './bannersSlider.json';
import bannersRow from './bannersRow.json';

class Start extends PureComponent<{}> {
  render() {
    const categories = pathOr(null, ['categories', 'children'], this.context.directories);
    const mostViewedProducts = pathOr(null, [
      'mainPage',
      'findMostViewedProducts',
      'edges',
    ], this.props);
    const mostDiscountProducts = pathOr(null, [
      'mainPage',
      'findMostDiscountProducts',
      'edges',
    ], this.props);
    return (
      <div styleName="container">
        {categories && <CategoriesMenu categories={categories} />}
        <div styleName="item">
          <BannersSlider items={bannersSlider} />
        </div>
        <div styleName="item">
          <GoodsSlider
            items={mostViewedProducts}
            title="Популярное"
          />
        </div>
        <div styleName="item">
          <GoodsSlider
            items={mostDiscountProducts}
            title="Распродажа"
          />
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
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
  currentUser: currentUserShape,
};

export default createFragmentContainer(
  Page(Start),
  graphql`
    fragment Start_mainPage on MainPage {
      findMostViewedProducts(searchTerm: {options: {attrFilters: [],categoriesIds: []}}) {
        edges {
          node {
            id
            rawId
            baseProduct {
              id
              rawId
              name {
                lang
                text
              }
              currencyId
            }
            variants {
              id
              rawId
              product {
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
      findMostDiscountProducts(searchTerm: {options: {attrFilters: [],categoriesIds: []}}) {
        edges {
          node {
            id
            rawId
            baseProduct {
              id
              rawId
              name {
                lang
                text
              }
              currencyId
            }
            variants {
              id
              rawId
              product {
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
