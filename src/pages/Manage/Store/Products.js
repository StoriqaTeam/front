// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { assocPath, pathOr, toUpper, isEmpty, filter, map, head } from 'ramda';
import { withRouter, routerShape } from 'found';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';
// import { CreateStoreMutation } from 'relay/mutations';
import { Container, Row, Col } from 'layout';
import { getNameText, formatPrice } from 'utils';
import { withShowAlert } from 'components/App/AlertContext';
import { Button } from 'components/common/Button';
import { Checkbox } from 'components/common/Checkbox';
import { Icon } from 'components/Icon';

import type { AddAlertInputType } from 'components/App/AlertContext';
import BannerLoading from 'components/Banner/BannerLoading';
import ImageLoader from 'libs/react-image-loader';

import Menu from './Menu';
import Header from './Header';

import './Products.scss';
import { createFragmentContainer, graphql } from 'react-relay';

type PropsType = {
  // router: routerShape,
  // showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  activeItem: string,
  serverValidationErrors: any,
  isLoading: boolean,
};

class Products extends Component<PropsType, StateType> {
  // state: StateType = {
  //   //
  // };

  renderHeaderRow = () => {
    return (
      <div styleName="headerRowWrap">
        <div styleName="td tdCheckbox">
          <Checkbox id="header" onChange={() => {}} />
        </div>
        <div styleName="td tdFoto" />
        <div styleName="td tdName">
          <div styleName="tdWrap">
            <span>Name</span>
            <Icon inline type="sortArrows" />
          </div>
        </div>
        <div styleName="td tdCategory">
          <div styleName="tdWrap">
            <span>Category</span>
            <Icon inline type="sortArrows" />
          </div>
        </div>
        <div styleName="td tdPrice">
          <div styleName="tdWrap">
            <span>Price</span>
            <Icon inline type="sortArrows" />
          </div>
        </div>
        <div styleName="td tdCashback">
          <div styleName="tdWrap">
            <span>Cashback</span>
            <Icon inline type="sortArrows" />
          </div>
        </div>
        <div styleName="td tdCharacteristics">
          <span>Characteristics</span>
          <Icon inline type="sortArrows" />
        </div>
        <div styleName="td tdEdit" />
        <div styleName="td tdDelete">
          <button styleName="deleteButton">
            <Icon type="basket" size="32" />
          </button>
        </div>
        <div styleName="td tdDropdawn" />
      </div>
    );
  };

  renderRows = item => {
    console.log('---item', item);
    const { product } = item;
    const attributes = pathOr([], ['product', 'attributes'], item);
    console.log('---attributes', attributes);
    return (
      <div key={item.rawId} styleName="itemRowWrap">
        <div styleName="td tdCheckbox">
          <Checkbox id={`product-${item.rawId}`} onChange={() => {}} />
        </div>
        <div styleName="td tdFoto">
          <div styleName="foto">
            {!product.photoMain ? (
              <Icon type="camera" size="40" />
            ) : (
              <ImageLoader
                fit
                src={product.photoMain}
                loader={<BannerLoading />}
              />
            )}
          </div>
        </div>
        <div styleName="td tdName">
          <div styleName="tdWrap">
            <span>{item.name}</span>
          </div>
        </div>
        <div styleName="td tdCategory">
          <div styleName="tdWrap">
            <span>{item.categoryName}</span>
          </div>
        </div>
        <div styleName="td tdPrice">
          <div styleName="tdWrap">
            <span>{`${formatPrice(product.price)} STQ`}</span>
          </div>
        </div>
        <div styleName="td tdCashback">
          <div styleName="tdWrap">
            <span>{`${(product.cashback * 100).toFixed(0)}%`}</span>
          </div>
        </div>
        <div styleName="td tdCharacteristics">
          {!isEmpty(attributes) &&
            <div>
              <div styleName="characteristicItem">
                <div styleName="characteristicLabels">
                  {map(attributeItem => {
                    const attributeName = getNameText(attributeItem.attribute.name, 'EN');
                    return <div key={`attr-${attributeName}`}>{`${attributeName}: `}</div>;
                  }, attributes)}
                </div>
                <div styleName="characteristicValues">
                  {map(attributeItem => {
                    const attributeName = getNameText(attributeItem.attribute.name, 'EN');
                    const val = attributeItem.value;
                    return <div key={`attr-${attributeName}`}>{`${val}`}</div>;
                  }, attributes)}
                </div>
              </div>
            </div>
          }
        </div>
        <div styleName="td tdEdit">
          <button styleName="editButton">
            <Icon type="note" size={32} />
          </button>
        </div>
        <div styleName="td tdDelete">
          <button styleName="deleteButton">
            <Icon type="basket" size="32" />
          </button>
        </div>
        <div styleName="td tdDropdawn">
          <button
            styleName="arrowExpand"
            onClick={() => {}}
          >
            <Icon inline type="arrowExpand" />
          </button>
        </div>
      </div>
    );
  };

  render() {
    const baseProducts = pathOr(
      [],
      ['me', 'store', 'baseProducts', 'edges'],
      this.props,
    );
    const products = map(item => {
      const newItem = {
        ...item.node,
        categoryName: getNameText(item.node.category.name, 'EN'),
        name: getNameText(item.node.name, 'EN'),
        shortDescription: getNameText(item.node.shortDescription, 'EN'),
        product: head(item.node.products.edges)
          ? head(item.node.products.edges).node
          : null,
      };
      return newItem;
    }, baseProducts);
    const filteredProducts = filter(item => item.product, products);
    console.log('---filteredProducts', filteredProducts);
    return (
      <Container>
        <Row>
          <Col size={2}>
            <Menu activeItem="goods" switchMenu={() => {}} storeLogo="" />
          </Col>
          <Col size={10}>
            <div styleName="container">
              <Header title="Goods" />
              <div styleName="wrapper">
                <div styleName="addButton">
                  <Button wireframe big onClick={() => {}}>
                    Add item
                  </Button>
                </div>
                <div styleName="subtitle">
                  <strong>Goods list</strong>
                </div>
                <div styleName="body">
                  <div styleName="headerRow">{this.renderHeaderRow()}</div>
                  <div styleName="list">
                    {map(item => {
                      return this.renderRows(item);
                    }, filteredProducts)}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

// export default withShowAlert(withRouter(Page(Products)));

Products.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
  currentUser: currentUserShape,
  showAlert: PropTypes.func,
};

export default createFragmentContainer(
  withShowAlert(withRouter(Page(Products))),
  graphql`
    fragment Products_me on User
      @argumentDefinitions(storeId: { type: "Int!" }) {
      store(id: $storeId) {
        id
        logo
        baseProducts(first: 100) @connection(key: "Wizard_baseProducts") {
          edges {
            node {
              id
              rawId
              name {
                text
                lang
              }
              shortDescription {
                lang
                text
              }
              category {
                id
                rawId
                name {
                  lang
                  text
                }
              }
              storeId
              currencyId
              products(first: 1) @connection(key: "Wizard_products") {
                edges {
                  node {
                    id
                    rawId
                    price
                    discount
                    photoMain
                    additionalPhotos
                    vendorCode
                    cashback
                    price
                    attributes {
                      value
                      metaField
                      attribute {
                        id
                        rawId
                        name {
                          lang
                          text
                        }
                        metaField {
                          values
                          translatedValues {
                            translations {
                              text
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
);
