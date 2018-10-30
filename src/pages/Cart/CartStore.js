// @flow

import React, { Component } from 'react';
import { createFragmentContainer, graphql, Relay } from 'react-relay';
import { filter, whereEq, toUpper, isEmpty, pathOr } from 'ramda';
import { Link } from 'found';

import { CurrencyPrice, Input, Button } from 'components/common';
import { Rating } from 'components/common/Rating';
import { Icon } from 'components/Icon';
import { withShowAlert } from 'components/App/AlertContext';
import { Container, Row, Col } from 'layout';
import {
  formatPrice,
  getNameText,
  currentCurrency,
  convertSrc,
  log,
  fromRelayError,
} from 'utils';

import { SetCouponInCartMutation } from 'relay/mutations';

import type { AddAlertInputType } from 'components/App/AlertContext';
import type { MutationParamsType as SetCouponInCartMutationType } from 'relay/mutations/SetCouponInCartMutation';

import CartProduct from './CartProduct';

// eslint-disable-next-line
import type CartStore_store from './__generated__/CartStore_store.graphql';

import './CartStore.scss';

type StateType = {
  couponCodeValue: string,
  couponCodeButtonDisabled: boolean,
  isLoadingCouponButton: boolean,
};

type PropsType = {
  onlySelected: ?boolean,
  unselectable: ?boolean,
  // eslint-disable-next-line
  store: CartStore_store,
  isOpenInfo: ?boolean,
  priceUsd: ?number,
  relay: Relay,
  showAlert: (input: AddAlertInputType) => void,
};

/* eslint-disable react/no-array-index-key */
class CartStore extends Component<PropsType, StateType> {
  state = {
    couponCodeValue: '',
    couponCodeButtonDisabled: true,
    isLoadingCouponButton: false,
  };

  handleChangeCoupon = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const value = toUpper(e.target.value);
    if (!/^[A-Za-z0-9]*$/.test(value)) {
      return;
    }
    this.setState({
      couponCodeValue: toUpper(value),
      couponCodeButtonDisabled: !value,
    });
  };

  handleSetCoupon = () => {
    this.setState({ isLoadingCouponButton: true });
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['store', 'rawId'], this.props);
    const params: SetCouponInCartMutationType = {
      input: {
        clientMutationId: '',
        couponCode: this.state.couponCodeValue,
        storeId,
      },
      environment: this.props.relay.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState({ isLoadingCouponButton: false });
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }

        // $FlowIgnoreMe
        const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `Error: "${statusError}"`,
            link: { text: 'Close.' },
          });
          return;
        }

        // $FlowIgnoreMe
        const status400Error = pathOr('', ['400', 'status'], relayErrors);
        if (status400Error) {
          this.props.showAlert({
            type: 'danger',
            // $FlowIgnoreMe
            text: `Error: ${status400Error}`,
            link: { text: 'Close.' },
          });
          return;
        }
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Сoupon applied!',
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoadingCouponButton: false }));
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong.',
          link: { text: 'Close.' },
        });
      },
    };
    SetCouponInCartMutation.commit(params);
  };

  render() {
    console.log('---this.props', this.props);
    const {
      store,
      onlySelected,
      unselectable,
      isOpenInfo,
      priceUsd,
    } = this.props;
    const {
      couponCodeValue,
      couponCodeButtonDisabled,
      isLoadingCouponButton,
    } = this.state;
    const { products } = store;
    let filteredProducts = products;
    if (onlySelected) {
      filteredProducts = filter(whereEq({ selected: true }), products);
    }
    if (filteredProducts.length === 0) {
      return null;
    }
    return (
      <div styleName="container">
        {filteredProducts.map((product, idx) => (
          <div key={idx}>
            <CartProduct
              product={product}
              onlySelected={onlySelected}
              unselectable={unselectable}
              isOpenInfo={isOpenInfo}
              priceUsd={priceUsd}
            />
            <div styleName="devider" />
          </div>
        ))}
        <div styleName="footer">
          <Container correct>
            <Row alignItems="center">
              <Col size={12} sm={3}>
                <div styleName="storeInfo">
                  <Link to={`/store/${store.rawId}`}>
                    {store.logo ? (
                      <img
                        src={convertSrc(store.logo, 'small')}
                        alt="store_picture"
                        styleName="image"
                      />
                    ) : (
                      <div styleName="noLogo">
                        <Icon type="camera" size={28} />
                      </div>
                    )}
                    <div styleName="store-description">
                      <div styleName="store-name">
                        {getNameText(store.name, 'EN')}
                      </div>
                      <Rating value={store.rating} />
                    </div>
                  </Link>
                </div>
              </Col>
              <Col size={12} sm={6}>
                <div styleName="coupon">
                  <div styleName="couponIcon">
                    <Icon type="coupon" size={28} />
                  </div>
                  <div styleName="couponInput">
                    <Input
                      id="couponInput"
                      inline
                      fullWidth
                      value={couponCodeValue}
                      onChange={this.handleChangeCoupon}
                    />
                  </div>
                  <div styleName="couponButton">
                    <Button
                      small
                      disabled={couponCodeButtonDisabled}
                      onClick={this.handleSetCoupon}
                      isLoading={isLoadingCouponButton}
                      dataTest="couponButton"
                    >
                      Apply code
                    </Button>
                  </div>
                </div>
              </Col>
              <Col size={12} sm={3}>
                <div styleName="storeTotal">
                  <div styleName="storeTotalWrapper">
                    <div styleName="label">Subtotal</div>
                    <div styleName="value">
                      {formatPrice(store.productsCost || 0)} {currentCurrency()}
                    </div>
                    {priceUsd && (
                      <CurrencyPrice
                        price={store.productsCost || 0}
                        currencyPrice={priceUsd}
                        currencyCode="USD"
                        toFixedValue={2}
                      />
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(
  withShowAlert(CartStore),
  graphql`
    fragment CartStore_store on CartStore {
      id
      rawId
      productsCost
      deliveryCost
      totalCost
      totalCount
      products {
        selected
        coupon {
          id
          rawId
          code
          title
          scope
        }
        ...CartProduct_product
      }
      name {
        lang
        text
      }
      rating
      logo
    }
  `,
);
