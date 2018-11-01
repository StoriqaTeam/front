// @flow

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pipe, path, pathOr, head, defaultTo } from 'ramda';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import { withShowAlert } from 'components/App/AlertContext';
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

import type { AddAlertInputType } from 'components/App/AlertContext';

import ProductInfo from './ProductInfo';

// eslint-disable-next-line
import type CartProduct_product from './__generated__/CartProduct_product.graphql';

import './CartProduct.scss';

type PropsType = {
  unselectable: ?boolean,
  showAlert: (input: AddAlertInputType) => void,
  // eslint-disable-next-line
  ...CartProduct_product,
  isOpenInfo: ?boolean,
  withDeliveryCompaniesSelect?: boolean,
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
        log.debug('Success for DeleteFromCart mutation');
        if (response) {
          log.debug('Response: ', response);
        }
        if (errors) {
          log.debug('Errors: ', errors);
        }
      },
      onError: error => {
        log.error('Error in DeleteFromCart mutation');
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Unable to delete product quantity in cart',
          link: { text: 'Close.' },
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
        log.debug('Success for SetSelectionInCart mutation');
        if (response) {
          log.debug('Response: ', response);
        }
        if (errors) {
          log.debug('Errors: ', errors);
        }
      },
      onError: error => {
        log.error('Error in SetSelectionInCart mutation');
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Unable to set product selection in cart',
          link: { text: 'Close.' },
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
        log.debug('Success for SetQuantityInCart mutation');
        if (response) {
          log.debug('Response: ', response);
        }
        if (errors) {
          log.debug('Errors: ', errors);
        }
      },
      onError: error => {
        log.error('Error in SetQuantityInCart mutation');
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Unable to set product quantity in cart',
          link: { text: 'Close.' },
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
          log.debug('Success for SetCommentInCart mutation');
          if (response) {
            log.debug('Response: ', response);
          }
          if (errors) {
            log.debug('Errors: ', errors);
          }
        },
        onError: error => {
          log.error('Error in SetCommentInCart mutation');
          log.error(error);
          this.props.showAlert({
            type: 'danger',
            text: 'Unable to set comment for product',
            link: { text: 'Close.' },
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
    } = this.props;
    if (!product) return null;
    const name: ?string = pipe(
      pathOr([], ['name']),
      head,
      defaultTo({}),
      path(['text']),
    )(product);
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
                    <div
                      styleName="picture"
                      style={{
                        backgroundImage: `url(${convertSrc(
                          photoMain,
                          'medium',
                        )})`,
                      }}
                    />
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
      }
    }
  `,
);

CartProduct.contextTypes = {
  environment: PropTypes.object.isRequired,
};
