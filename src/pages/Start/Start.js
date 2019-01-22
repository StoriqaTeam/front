// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, map, head, isEmpty } from 'ramda';
import axios from 'axios';
import { Link } from 'found';

import MediaQuery from 'libs/react-responsive';
import { log, convertSrc } from 'utils';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
import { BannersSlider } from 'components/BannersSlider';
import { BannersRow } from 'components/BannersRow';
import ImageLoader from 'libs/react-image-loader';
import BannerLoading from 'components/Banner/BannerLoading';
import Goods from './Goods';

import type { Start_mainPage as StartMainPage } from './__generated__/Start_mainPage.graphql';

import './Start.scss';

import t from './i18n';

opaque type BannerRecordType = {
  id: string,
  desktop: string,
  tablet: string,
  phone: string,
  link: string,
};

type StateTypes = {
  priceUsd: ?number,
  banners: {
    main: Array<BannerRecordType>,
    middle: Array<BannerRecordType>,
    bottom: Array<BannerRecordType>,
  },
};

type PropsTypes = {
  mainPage: StartMainPage,
};

const Loader = (
  <div styleName="loader">
    <BannerLoading />
  </div>
);

const BannerPlaceholder = () => (
  <div styleName="bannerPlaceholder">
    <BannerLoading />
  </div>
);

class Start extends Component<PropsTypes, StateTypes> {
  state = {
    priceUsd: null,
    banners: {
      main: [],
      middle: [],
      bottom: [],
    },
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
        return true;
      })
      .catch(error => {
        log.debug(error);
      });

    axios
      .get(
        'https://s3.eu-central-1.amazonaws.com/dumpster.stq/banners/banners.json',
      )
      .then(({ data }) => {
        if (this.isMount) {
          this.setState({ banners: data });
        }
        return true;
      })
      .catch(log.error);
  }

  componentWillUnmount() {
    this.isMount = false;
  }

  isMount = false;

  renderStartSellingBanner = () => (
    <Fragment>
      {this.state.banners.middle instanceof Array &&
      this.state.banners.middle[0] != null ? (
        <Fragment>
          <MediaQuery maxWidth={575}>
            <ImageLoader
              fit
              src={this.state.banners.middle[0].phone}
              loader={Loader}
            />
          </MediaQuery>
          <MediaQuery maxWidth={991} minWidth={576}>
            <ImageLoader
              fit
              src={this.state.banners.middle[0].tablet}
              loader={Loader}
            />
          </MediaQuery>
          <MediaQuery minWidth={992}>
            <ImageLoader
              fit
              src={this.state.banners.middle[0].desktop}
              loader={Loader}
            />
          </MediaQuery>
        </Fragment>
      ) : (
        <div styleName="placeholder">
          <BannerLoading />
        </div>
      )}
    </Fragment>
  );

  render() {
    console.log('this.props', this.props);
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
    // $FlowIgnoreMe
    const isCompletedWizardStore = pathOr(
      false,
      ['me', 'wizardStore', 'completed'],
      this.props,
    );
    // $FlowIgnoreMe
    const myStoreRawId = pathOr(null, ['me', 'myStore', 'rawId'], this.props);

    return (
      <div styleName="container">
        <div styleName="item bannerSliderItem">
          <MediaQuery maxWidth={575}>
            {isEmpty(this.state.banners.main) ? (
              <BannerPlaceholder />
            ) : (
              <BannersSlider
                items={map(
                  item => ({
                    id: item.id,
                    img: convertSrc(item.phone, 'medium'),
                    link: item.link,
                  }),
                  this.state.banners.main,
                )}
              />
            )}
          </MediaQuery>
          <MediaQuery maxWidth={991} minWidth={576}>
            {isEmpty(this.state.banners.main) ? (
              <BannerPlaceholder />
            ) : (
              <BannersSlider
                items={map(
                  item => ({
                    id: item.id,
                    img: convertSrc(item.tablet, 'large'),
                    link: item.link,
                  }),
                  this.state.banners.main,
                )}
              />
            )}
          </MediaQuery>
          <MediaQuery minWidth={992}>
            {isEmpty(this.state.banners.main) ? (
              <BannerPlaceholder />
            ) : (
              <BannersSlider
                items={map(
                  item => ({
                    id: item.id,
                    img: item.desktop,
                    link: item.link,
                  }),
                  this.state.banners.main,
                )}
              />
            )}
          </MediaQuery>
        </div>
        <div styleName="item goodsItem">
          {viewedProducts &&
            viewedProducts.length > 0 && (
              <Goods
                items={viewedProducts}
                title={t.mostPopular}
                seeAllUrl="/categories?search=&sortBy=VIEWS"
              />
            )}
        </div>
        <div styleName="item bannerImage">
          {isCompletedWizardStore && myStoreRawId ? (
            <Link to={`/manage/store/${myStoreRawId}`} styleName="sellingImage">
              {this.renderStartSellingBanner()}
            </Link>
          ) : (
            <a href="https://selling.storiqa.com" styleName="sellingImage">
              {this.renderStartSellingBanner()}
            </a>
          )}
        </div>
        <div styleName="item goodsItem">
          {discountProducts &&
            discountProducts.length > 0 && (
              <Goods
                items={discountProducts}
                title={t.sale}
                seeAllUrl="/categories?search=&sortBy=DISCOUNT"
              />
            )}
        </div>
        {this.state.banners.bottom instanceof Array &&
          !isEmpty(this.state.banners.bottom) && (
            <div styleName="item bannersItem">
              <MediaQuery maxWidth={767}>
                <BannersRow
                  items={map(
                    item => ({ ...item, img: item.phone }),
                    this.state.banners.bottom,
                  )}
                  count={2}
                />
              </MediaQuery>
              <MediaQuery maxWidth={1199} minWidth={768}>
                <BannersRow
                  items={map(
                    item => ({ ...item, img: item.tablet }),
                    this.state.banners.bottom,
                  )}
                  count={2}
                />
              </MediaQuery>
              <MediaQuery minWidth={1200}>
                <BannersRow
                  items={map(
                    item => ({ ...item, img: item.desktop }),
                    this.state.banners.bottom,
                  )}
                  count={2}
                />
              </MediaQuery>
            </div>
          )}
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
        first: 24
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
        first: 24
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
