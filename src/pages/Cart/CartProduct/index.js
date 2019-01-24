// @flow

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pipe, path, pathOr, head, defaultTo } from 'ramda';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import { withShowAlert } from 'components/Alerts/AlertContext';
import { Checkbox } from 'components/Checkbox';
import { Icon } from 'components/Icon';
import { Container, Col, Row } from 'layout';
import {
  SetQuantityInCartMutation,
  SetSelectionInCartMutation,
  DeleteFromCartMutation,
  SetCommentInCartMutation,
} from 'relay/mutations';
import { log, convertSrc } from 'utils';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import ProductInfo from '../ProductInfo';

// eslint-disable-next-line
import type CartProduct_product from './__generated__/CartProduct_product.graphql';

import './CartProduct.scss';

import t from './i18n';

type PropsType = {
  unselectable: ?boolean,
  showAlert: (input: AddAlertInputType) => void,
  // eslint-disable-next-line
  ...CartProduct_product,
  isOpenInfo: ?boolean,
  withDeliveryCompaniesSelect?: boolean,
  currencyType: 'FIAT' | 'CRYPTO',
};

type StateType = {
  comment: string,
};

class CartProduct extends Component<PropsType, StateType> {
  static defaultProps = {
    withDeliveryCompaniesSelect: false,
  };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      comment: props.product && props.product.comment,
    };
  }

  handleDelete() {
    const id = this.props.product.rawId;
    DeleteFromCartMutation.commit({
      input: { clientMutationId: '', productId: id },
      environment: this.context.environment,
      onCompleted: (response, errors) => {
        log.debug(t.successForDeleteFromCart);
        if (response) {
          log.debug(t.response, response);
        }
        if (errors) {
          log.debug(t.errors, errors);
        }
      },
      onError: error => {
        log.error(t.errorInDeleteFromCart);
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: t.unableToDeleteProductQuantity,
          link: { text: t.close },
        });
      },
    });
  }

  handleSelectChange() {
    const { rawId: productId, id: nodeId } = this.props.product;
    SetSelectionInCartMutation.commit({
      input: {
        clientMutationId: '',
        productId,
        value: !this.props.product.selected,
      },
      nodeId,
      environment: this.context.environment,
      onCompleted: (response, errors) => {
        log.debug(t.successForSetSelectionInCart);
        if (response) {
          log.debug(t.response, response);
        }
        if (errors) {
          log.debug(t.errors, errors);
        }
      },
      onError: error => {
        log.error(t.errorInSetSelectionInCart);
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: t.unableToSetProductSelection,
          link: { text: t.close },
        });
      },
    });
  }

  handleQuantityChange = newVal => {
    const { rawId: productId, id: nodeId } = this.props.product;
    const { storeId } = this.props;
    SetQuantityInCartMutation.commit({
      input: { clientMutationId: '', productId, value: newVal },
      nodeId,
      storeId,
      environment: this.context.environment,
      onCompleted: (response, errors) => {
        log.debug(t.successForSetQuantityInCart);
        if (response) {
          log.debug(t.response, response);
        }
        if (errors) {
          log.debug(t.errors, errors);
        }
      },
      onError: error => {
        log.error(t.errorInSetQuantityInCart);
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: t.unableToSetProductQuantity,
          link: { text: t.close },
        });
      },
    });
  };

  handleOnChangeComment = (e: any) => {
    const { rawId: productId } = this.props.product;
    const {
      target: { value },
    } = e;
    this.setState({ comment: value });
    this.handleOnSaveComment(productId, value);
  };

  handleOnSaveComment = debounce((productId, value) => {
    if (value) {
      SetCommentInCartMutation.commit({
        input: { clientMutationId: '', productId, value },
        environment: this.context.environment,
        onCompleted: (response, errors) => {
          log.debug(t.successForSetCommentInCart);
          if (response) {
            log.debug(t.response, response);
          }
          if (errors) {
            log.debug(t.errors, errors);
          }
        },
        onError: error => {
          log.error(t.errorInSetCommentInCart);
          log.error(error);
          this.props.showAlert({
            type: 'danger',
            text: t.unableToSetComment,
            link: { text: t.close },
          });
        },
      });
    }
  }, 250);

  render() {
    const {
      product,
      unselectable,
      isOpenInfo,
      withDeliveryCompaniesSelect,
      currencyType,
    } = this.props;
    if (!product) return null;
    const name: ?string = pipe(
      pathOr([], ['name']),
      head,
      defaultTo({}),
      path(['text']),
    )(product);
    log.debug('CartProduct', this.props);
    const { photoMain, selected } = product;
    return (
      <div styleName="container">
        <Container correct>
          <Row>
            <Col size={12} sm={3}>
              <Row>
                <Col size={4} sm={12}>
                  <div styleName="left-container">
                    {!unselectable && (
                      <div styleName="checkbox">
                        <Checkbox
                          id={`Cartproduct_${product.rawId}`}
                          label={false}
                          isChecked={selected}
                          onChange={() => this.handleSelectChange()}
                        />
                      </div>
                    )}
                    {photoMain ? (
                      <div
                        styleName="picture"
                        style={{
                          backgroundImage: `url(${convertSrc(
                            photoMain,
                            'medium',
                          )})`,
                        }}
                      />
                    ) : (
                      <div styleName="noLogo">
                        <Icon type="camera" size={40} />
                      </div>
                    )}
                  </div>
                </Col>
                <Col size={6} smHidden>
                  <div styleName="product-summary-header">{name}</div>
                </Col>
                <Col size={2} smHidden>
                  <div styleName="recycleContainer">
                    <button
                      styleName="recycle"
                      onClick={() => this.handleDelete()}
                      data-test="cartProductDeleteButton"
                    >
                      <Icon type="basket" size={32} />
                    </button>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col size={12} sm={9}>
              <Row withoutGrow>
                <Col size={10} sm={11} hidden smVisible>
                  <div styleName="product-summary-header">{name}</div>
                </Col>
                <Col size={2} sm={1} hidden smVisible>
                  <div styleName="recycleContainer">
                    <button
                      styleName="recycle"
                      onClick={() => this.handleDelete()}
                      data-test="cartProductDeleteButton"
                    >
                      <Icon type="basket" size={32} />
                    </button>
                  </div>
                </Col>
                <Col size={12}>
                  <div styleName="productInfoWrapper">
                    <ProductInfo
                      product={product}
                      onQuantityChange={this.handleQuantityChange}
                      onChangeComment={this.handleOnChangeComment}
                      comment={this.state.comment}
                      isOpen={isOpenInfo}
                      withDeliveryCompaniesSelect={withDeliveryCompaniesSelect}
                      currencyType={currencyType}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default createFragmentContainer(
  withShowAlert(CartProduct),
  graphql`
    fragment CartProduct_product on CartProduct {
      id
      rawId
      baseProduct(visibility: "active") {
        id
        isShippingAvailable
      }
      baseProductId
      subtotal
      subtotalWithoutDiscounts
      couponDiscount
      name {
        lang
        text
      }
      photoMain
      price
      preOrder
      preOrderDays
      quantity
      comment
      selected
      deliveryCost
      attributes {
        value
        metaField
        attribute {
          name {
            lang
            text
          }
          valueType
          metaField {
            values
            uiElement
            translatedValues {
              translations {
                lang
                text
              }
            }
          }
        }
      }
      coupon {
        id
        rawId
        code
        title
        scope
        percent
      }
      companyPackage {
        id
        rawId
      }
      selectPackage {
        id
        shippingId
      }
    }
  `,
);

CartProduct.contextTypes = {
  environment: PropTypes.object.isRequired,
};
