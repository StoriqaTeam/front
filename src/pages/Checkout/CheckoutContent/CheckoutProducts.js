// @flow

import React from 'react';
import { pathOr } from 'ramda';

import { Checkbox } from 'components/common/Checkbox';
import { Select } from 'components/common/Select';
import { Button } from 'components/common/Button';
import { Row, Col } from 'layout';

import { addressFullToString } from '../utils';

import './CheckoutProducts.scss';
import AddressInfo from './AddressInfo';

class CheckoutContent extends React.Component<PropsType> {
  state = {
    step: 1,
    // deliveryAddress: null,
  };

  render() {
    const { step } = this.state;
    const { orderInput, me, onChangeStep } = this.props;
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
                    onClick={onChangeStep(1)}
                    type="button"
                    dataTest="changeAddress"
                  >
                    <span>Replace address</span>
                  </Button>
                </Col>
                <Col size={12}>
                  {orderInput.addressFull.value && (
                    <AddressInfo
                      addressFull={orderInput.addressFull}
                      receiverName={
                        orderInput.receiverName ||
                        `${me.firstName} ${me.lastName}`
                      }
                      email={me.email}
                    />
                  )}
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
