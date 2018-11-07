// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, map, prepend, head } from 'ramda';
import axios from 'axios';

import MediaQuery from 'libs/react-responsive';
import { log, convertSrc } from 'utils';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { BannersSlider } from 'components/BannersSlider';
import { BannersRow } from 'components/BannersRow';
import { GoodsSlider } from 'components/GoodsSlider';
import ImageLoader from 'libs/react-image-loader';
import BannerLoading from 'components/Banner/BannerLoading';

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
    const storiqaShopId = process.env.REACT_APP_STORIQA_SHOP_ID || null;
    const bannersSliderWithMerge = prepend(
      {
        id: '0',
        img:
          'https://s3.us-east-1.amazonaws.com/storiqa-dev/img-OZnA7dnYf7EC.png',
        link: `/store/${Number(storiqaShopId)}`,
      },
      bannersSlider,
    );
    const loader = (
      <div styleName="loader">
        <BannerLoading />
      </div>
    );
    return (
      <div styleName="container">
        <div styleName="item bannerSliderItem">
          <Fragment>
            <MediaQuery maxWidth={575}>
              <BannersSlider
                items={
                  !storiqaShopId
                    ? map(
                        item => ({
                          id: `${item.id - 1}`,
                          img: convertSrc(item.img, 'medium'),
                          link: item.link,
                        }),
                        bannersSlider,
                      )
                    : map(
                        item => ({
                          ...item,
                          img: convertSrc(item.img, 'medium'),
                        }),
                        bannersSliderWithMerge,
                      )
                }
              />
            </MediaQuery>
            <MediaQuery maxWidth={991} minWidth={576}>
              <BannersSlider
                items={
                  !storiqaShopId
                    ? map(
                        item => ({
                          id: `${item.id - 1}`,
                          img: convertSrc(item.img, 'large'),
                          link: item.link,
                        }),
                        bannersSlider,
                      )
                    : map(
                        item => ({
                          ...item,
                          img: convertSrc(item.img, 'large'),
                        }),
                        bannersSliderWithMerge,
                      )
                }
              />
            </MediaQuery>
            <MediaQuery minWidth={992}>
              <BannersSlider
                items={
                  !storiqaShopId
                    ? map(
                        item => ({
                          id: `${item.id - 1}`,
                          img: item.img,
                          link: item.link,
                        }),
                        bannersSlider,
                      )
                    : bannersSliderWithMerge
                }
              />
            </MediaQuery>
          </Fragment>
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
          <a href="/start-selling" styleName="sellingImage">
            <MediaQuery maxWidth={575}>
              <ImageLoader
                fit
                src="https://s3.amazonaws.com/storiqa-dev/img-zUGsPEmPu8MC-medium.png"
                loader={loader}
              />
            </MediaQuery>
            <MediaQuery maxWidth={991} minWidth={576}>
              <ImageLoader
                fit
                src="https://s3.amazonaws.com/storiqa-dev/img-zUGsPEmPu8MC-large.png"
                loader={loader}
              />
            </MediaQuery>
            <MediaQuery minWidth={992}>
              <ImageLoader
                fit
                src="https://s3.amazonaws.com/storiqa-dev/img-zUGsPEmPu8MC.png"
                loader={loader}
              />
            </MediaQuery>
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
          <MediaQuery maxWidth={767}>
            <BannersRow
              items={map(
                item => ({ ...item, img: convertSrc(item.img, 'large') }),
                bannersRow,
              )}
              count={2}
            />
          </MediaQuery>
          <MediaQuery maxWidth={1199} minWidth={768}>
            <BannersRow
              items={map(
                item => ({ ...item, img: convertSrc(item.img, 'medium') }),
                bannersRow,
              )}
              count={2}
            />
          </MediaQuery>
          <MediaQuery minWidth={1200}>
            <BannersRow items={bannersRow} count={2} />
          </MediaQuery>
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
