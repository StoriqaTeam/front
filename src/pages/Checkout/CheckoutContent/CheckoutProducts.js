// @flow

import React from 'react';
import { pathOr } from 'ramda';

import { Checkbox } from 'components/common/Checkbox';
import { Select } from 'components/common/Select';
import { Button } from 'components/common/Button';
import { Row, Col } from 'layout';

import { addressFullToString } from '../utils';

import './CheckoutProducts.scss';

class CheckoutContent extends React.Component<PropsType> {
  state = {
    step: 1,
    // deliveryAddress: null,
  };

  render() {
    const { step } = this.state;
    const { orderInput, me } = this.props;
    // console.log('>>> checkout me', { me });
    return (
      <Row>
        <Col size={12}>
          <div styleName="container">
            <div styleName="title">Submit</div>
            <div styleName="infoContainer">
              <Row>
                <Col size={9}>
                  <div styleName="centeredTitle">
                    <div>Address</div>
                  </div>
                </Col>
                <Col size={3}>
                  <Button
                    big
                    contour
                    whireframe
                    onClick={console.log}
                    type="button"
                    dataTest="changeAddress"
                  >
                    <span>Replace address</span>
                  </Button>
                </Col>
                <Col size={12}>
                  <div styleName="infoContent">
                    <div>
                      {orderInput.addressFull.country},{' '}
                      {orderInput.addressFull.locality}
                    </div>
                    <div>{orderInput.addressFull.value}</div>
                    {/* {addressFullToString(orderInput.addressFull)} */}
                    <div styleName="name">
                      {orderInput.receiverName ||
                        `${me.firstName} ${me.lastName}`}
                    </div>
                    <div styleName="email">{me.email}</div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

export default CheckoutContent;
