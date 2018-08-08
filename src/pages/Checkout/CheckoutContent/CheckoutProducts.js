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

const CheckoutProducts = ({ orderInput, me, onChangeStep }: PropsType) => (
  <Row>
    <Col size={12}>
      <div styleName="container">
        <div styleName="title">Summary</div>
        <div styleName="infoContainer">
          <Row>
            <Col size={3}>
              <div styleName="centeredTitle">
                <div>Address</div>
              </div>
            </Col>
            <Col size={9} smVisible>
              <div styleName="wrapperAddressButton">
                <div styleName="containerAddressButton">
                  <Button
                    big
                    contour
                    onClick={onChangeStep(1)}
                    type="button"
                    dataTest="changeAddress"
                  >
                    <span>Replace address</span>
                  </Button>
                </div>
              </div>
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
            <Col size={12} smHidden>
              <div styleName="containerAddressButton2">
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
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  </Row>
);

export default CheckoutProducts;
