// @flow

import React from 'react';
import { Button } from 'components/common/Button';
import { Row, Col } from 'layout';

import AddressInfo from '../AddressInfo';

import './CheckoutProducts.scss';

import t from './i18n';

type PropsType = {
  orderInput: any,
  me: any,
  onChangeStep: Function,
};

const CheckoutProducts = ({ orderInput, me, onChangeStep }: PropsType) => (
  <Row>
    <Col size={12}>
      <div styleName="container">
        <div styleName="infoContainer">
          <Row>
            <Col size={12} smVisible>
              <div styleName="header">
                <div styleName="title">{t.summary}</div>
                <div styleName="wrapperAddressButton">
                  <div styleName="containerAddressButton">
                    <Button
                      big
                      contour
                      onClick={() => {
                        onChangeStep(1);
                      }}
                      type="button"
                      dataTest="changeAddress"
                    >
                      <span>{t.replaceAddress}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
            <Col size={12}>
              {orderInput.addressFull.value && (
                <div styleName="addressInfoWrapper">
                  <AddressInfo
                    addressFull={orderInput.addressFull}
                    receiverName={
                      orderInput.receiverName ||
                      `${me.firstName} ${me.lastName}`
                    }
                    email={me.email}
                  />
                </div>
              )}
            </Col>
            <Col size={12} smHidden>
              <div styleName="containerAddressButton2">
                <Button
                  big
                  contour
                  whireframe
                  onClick={() => {
                    onChangeStep(1);
                  }}
                  type="button"
                  dataTest="changeAddress"
                >
                  <span>{t.replaceAddress}</span>
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
