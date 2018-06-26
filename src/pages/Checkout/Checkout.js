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

// eslint-disable-next-line
import type Cart_cart from '../Cart/__generated__/Cart_cart.graphql';
import type Checkout_me from './__generated__/Checkout_me.graphql';

import CheckoutHeader from './CheckoutHeader';
import CheckoutAddress from './CheckoutContent/CheckoutAddress';
import CheckoutProducts from './CheckoutContent/CheckoutProducts';
import CheckoutSidebar from './CheckoutSidebar';

import './Checkout.scss';

type PropsType = {
  // eslint-disable-next-line
  cart: Cart_cart,
};

type Totals = {};

type StateType = {};

/* eslint-disable react/no-array-index-key */
class Checkout extends Component<PropsType, StateType> {
  state = {
    step: 1,
    selectedAddress: null,
    newAddress: null,
    orderInput: {
      addressFull: null,
      receiverName: null,
    },
  };

  componentWillMount() {}

  componentWillUnmount() {}

  getDeliveryItems = () => {
    const deliveryAddresses = pathOr(
      null,
      ['me', 'deliveryAddresses'],
      this.props,
    );
    return map(i => {
      if (!i.address || !i.address.value) {
        return null;
      }
      return { id: i.address.value, label: i.address.value };
    }, deliveryAddresses);
  };

  handleChangeStep = step => {
    console.log('**** step: ', step);
    this.setState({ step });
  };

  handleCheckReadyToNext = () => {
    const { step, deliveryAddress } = this.state;
    return true;
  };

  handleOnSelectAddress = item => {
    console.log('>>> handle on select address item: ', { item });
    this.setState({ selectedAddress: item });
  };

  handleOnChangeNewAddress = (data: any) => {
    this.setState(prevState => ({}));
  };

  render() {
    console.log('>>> Checkout props: ', this.props);
    // const deliveryAddresses = pathOr(null, ['me', 'deliveryAddresses'], this.props);
    // const { me } = this.props;

    const { step, selectedAddress, newAddress } = this.state;
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
                      deliveryItems={this.getDeliveryItems()}
                      onSelectAddress={this.handleOnSelectAddress}
                      selectedAddress={selectedAddress}
                      newAddress={newAddress}
                    />
                  )}
                  {step === 2 && (
                    <CheckoutProducts deliveryAddresses={deliveryAddresses} />
                  )}
                </div>
              </Col>
              <Col size={3}>
                <CheckoutSidebar />
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
  `,
);
