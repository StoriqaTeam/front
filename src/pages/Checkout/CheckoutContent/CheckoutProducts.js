// @flow

import React from 'react';
import { Button } from 'components/common/Button';
import { Row, Col } from 'layout';

import './CheckoutProducts.scss';
import AddressInfo from './AddressInfo';

type PropsType = {
  orderInput: any,
  me: any,
  onChangeStep: Function,
};

const CheckoutContent = ({ orderInput, me, onChangeStep }: PropsType) => (
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
                    orderInput.receiverName || `${me.firstName} ${me.lastName}`
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

export default CheckoutContent;
