// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, map, prepend, head } from 'ramda';
import axios from 'axios';

import { log } from 'utils';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { BannersSlider } from 'components/BannersSlider';
import { BannersRow } from 'components/BannersRow';
import { GoodsSlider } from 'components/GoodsSlider';

import type { Start_mainPage as StartMainPage } from './__generated__/Start_mainPage.graphql';

import './Start.scss';

import t from './i18n';

import bannersSlider from './bannersSlider.json';
import bannersRow from './bannersRow.json';

type StateTypes = {
  priceUsd: ?number,
};

type PropsTypes = {
  mainPage: StartMainPage,
};

class Start extends Component<PropsTypes, StateTypes> {
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
    const { mainPage } = this.props;
    const { priceUsd } = this.state;
    // $FlowIgnoreMe
    const mostViewedProducts = pathOr(
      [],
      ['findMostViewedProducts', 'edges'],
      mainPage,
    );
    // $FlowIgnoreMe
    const mostDiscountProducts = pathOr(
      [],
      ['findMostDiscountProducts', 'edges'],
      mainPage,
    );

    const discountProducts = map(
      item => ({ ...item.node, priceUsd }),
      mostDiscountProducts,
    );
    const viewedProducts = map(
      item => ({ ...item.node, priceUsd }),
      mostViewedProducts,
    );
    const bannersSliderWithMerge = prepend(
      {
        id: '0',
        img:
          'https://s3.us-east-1.amazonaws.com/storiqa-dev/img-OZnA7dnYf7EC.png',
        link: `/store/${Number(process.env.REACT_APP_STORIQA_SHOP_ID || null)}`,
      },
      bannersSlider,
    );
    return (
      <div styleName="container">
        <div styleName="item bannerSliderItem">
          <BannersSlider
            items={
              !process.env.REACT_APP_STORIQA_SHOP_ID
                ? map(
                    item => ({
                      ...item,
                      id: `${item.id - 1}`,
                    }),
                    bannersSlider,
                  )
                : bannersSliderWithMerge
            }
          />
        </div>
        <div styleName="item goodSliderItem">
          {viewedProducts &&
            viewedProducts.length > 0 && (
              <GoodsSlider
                items={viewedProducts}
                title={t.mostPopular}
                seeAllUrl="/categories?search=&sortBy=VIEWS"
              />
            )}
        </div>
        <div styleName="item bannerImage">
          <a href="/start-selling">
            <img
              src="https://s3.amazonaws.com/storiqa-dev/img-zUGsPEmPu8MC.png"
              alt=""
            />
          </a>
        </div>
        <div styleName="item goodSliderItem">
          {discountProducts &&
            discountProducts.length > 0 && (
              <GoodsSlider
                items={discountProducts}
                title={t.sale}
                seeAllUrl="/categories?search=&sortBy=DISCOUNT"
              />
            )}
        </div>
        <div styleName="item bannersItem">
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
  Page(Start, true),
  graphql`
    fragment Start_mainPage on MainPage {
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
