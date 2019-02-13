// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, map, isEmpty } from 'ramda';
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
import { Container, Row, Col } from 'layout';

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
  banners: {
    main: Array<BannerRecordType>,
    middle: Array<BannerRecordType>,
    bottom: Array<BannerRecordType>,
  },
  header: Array<{ title: string, description: string }>,
  about: Array<{ title: string, description: string }>,
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
    banners: {
      main: [],
      middle: [],
      bottom: [],
    },
    header: [
      {
        title: 'Fancy stuff',
        description: 'Express yourself with unique handmade items',
      },
      {
        title: 'Unique Sellers',
        description: 'Discover exclusive items from any corner of the globe',
      },
      {
        title: 'Variety of Payment Options',
        description:
          'Choose any payment method, from credit card to cryptocurrencies',
      },
    ],
    about: [
      {
        title: 'A marketplace for self-expression',
        description:
          'Storiqa is a place for unique items which allow expressing your soul. Here people come to find unique gifts or treat themselves with fancy stuff.',
      },
      {
        title: 'Worldwide community',
        description:
          'Storiqa is an online marketplace which global on every side. We have an international community and support that help you buy and sell craft items.',
      },
      {
        title: 'Cryptopayment option',
        description:
          'Along with traditional payments, you can finally try out paying for goods with cryptocurrencies—it’s now real with Storiqa.',
      },
    ],
  };

  componentDidMount() {
    this.isMount = true;

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
    const { mainPage } = this.props;
    const { header, about } = this.state;
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
      item => ({ ...item.node }),
      mostDiscountProducts,
    );
    const viewedProducts = map(item => ({ ...item.node }), mostViewedProducts);
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
        <div styleName="header">
          Storiqa brings <strong>unique, custom</strong>, and{' '}
          <strong>handcrafted</strong> items to your life.
        </div>
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
        <div>
          <Container>
            <Row>
              {header.map(({ title, description }) => (
                <Col key={title} size={12} sm={12} md={12} lg={4} xl={4}>
                  <div styleName="subHeading">
                    <strong>{title}</strong>
                    <p styleName="description">{description}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
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
        <div styleName="item goodsItem">
          <div styleName="aboutStoriqa">
            <div styleName="aboutHeading">
              We all have inner spirit. We are all individuals. Stand out with
              Storiqa.
            </div>
            <a styleName="readmoreAboutStoriqa" href="www.storiqa.com">
              Read more about Storiqa
            </a>
            <Container>
              <Row>
                {about.map(({ title, description }) => (
                  <Col key={title} size={12} sm={12} md={12} lg={4} xl={4}>
                    <div styleName="subHeading short">
                      <div styleName="aboutTitle">{title}</div>
                      <p styleName="aboutDescription">{description}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </div>
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
