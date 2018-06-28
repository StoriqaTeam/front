// @flow
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import {
  pipe,
  pathOr,
  path,
  map,
  prop,
  propEq,
  groupBy,
  filter,
  reject,
  isNil,
  reduce,
  head,
  defaultTo,
} from 'ramda';

import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';

import type { AddressFullType } from 'components/AddressAutocomplete/AddressForm';

// eslint-disable-next-line
import type Cart_cart from '../Cart/__generated__/Cart_cart.graphql';
import type CartStoresLocalFragment from '../Cart/__generated__/CartStoresLocalFragment.graphql';
import type Checkout_me from './__generated__/Checkout_me.graphql';

import CheckoutHeader from './CheckoutHeader';
import CheckoutAddress from './CheckoutContent/CheckoutAddress';
import CheckoutProducts from './CheckoutContent/CheckoutProducts';
import CheckoutSidebar from './CheckoutSidebar';

import CartStore from '../Cart/CartStore';

import './Checkout.scss';

type PropsType = {
  // eslint-disable-next-line
  cart: Cart_cart,
};

type Totals = {};

type StateType = {
  orderInput: {
    addressFull: AddressFullType,
    receiverName: string,
  },
};

/* eslint-disable react/no-array-index-key */
class Checkout extends Component<PropsType, StateType> {
  state = {
    step: 1,
    isAddressSelect: true,
    isNewAddress: false,
    orderInput: {
      addressFull: {
        value: '',
        country: '',
        administrativeAreaLevel1: '',
        administrativeAreaLevel2: '',
        locality: '',
        political: '',
        postalCode: '',
        route: '',
        streetNumber: '',
        placeId: '',
      },
      receiverName: '',
    },
  };

  handleChangeStep = step => {
    console.log('**** step: ', step);
    this.setState({ step });
  };

  handleCheckReadyToNext = () => {
    const { step, deliveryAddress } = this.state;
    return true;
  };

  handleOnChangeOrderInput = orderInput => {
    console.log('>>> handleOnChangeOrderInput data: ', { orderInput });
    this.setState({ orderInput });
  };

  handleOnChangeAddressType = () => {
    this.setState(prevState => ({
      isAddressSelect: !prevState.isAddressSelect,
      isNewAddress: !prevState.isNewAddress,
    }));
  };

  render() {
    console.log('>>> Checkout props: ', this.props);
    // const deliveryAddresses = pathOr(null, ['me', 'deliveryAddresses'], this.props);
    const { me } = this.props;

    const deliveryAddresses = pathOr(
      null,
      ['me', 'deliveryAddresses'],
      this.props,
    );
    const { step, isAddressSelect, isNewAddress, orderInput } = this.state;
    const { cart } = this.props;
    console.log('>>> Checkout state : ', { orderInput });
    return (
      <Container withoutGrow>
        <Row withoutGrow>
          <Col size={12}>
            <CheckoutHeader
              currentStep={step}
              isReadyToNext={this.handleCheckReadyToNext}
              onChangeStep={this.handleChangeStep}
            />
          </Col>
          <Col size={12}>
            <Row withoutGrow>
              <Col size={9}>
                <div styleName="container">
                  {step === 1 && (
                    <CheckoutAddress
                      isAddressSelect={isAddressSelect}
                      isNewAddress={isNewAddress}
                      onChangeAddressType={this.handleOnChangeAddressType}
                      deliveryAddresses={deliveryAddresses || []}
                      orderInput={orderInput}
                      onChangeOrderInput={this.handleOnChangeOrderInput}
                    />
                  )}
                  {step === 2 && (
                    <CheckoutProducts me={me} orderInput={orderInput} />
                  )}
                </div>
              </Col>
              <Col size={3}>
                <CheckoutSidebar cart={cart} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

// export default Page(Checkout);
export default createFragmentContainer(
  Page(Checkout),
  graphql`
    fragment Checkout_me on User {
      id
      rawId
      email
      firstName
      lastName
      deliveryAddresses {
        address {
          value
          country
          administrativeAreaLevel1
          administrativeAreaLevel2
          locality
          political
          postalCode
          route
          streetNumber
          placeId
        }
      }
    }

    fragment Checkout_cart on Cart {
      stores {
        edges {
          node {
            deliveryCost
            totalCost
            totalCount
            productsCost
            products {
              rawId
            }
            ...CartStore_store
          }
        }
      }
    }
  `,
);
