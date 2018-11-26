// @flow strict

import React from 'react';
import { Button } from 'components/common/Button';
import { Row, Col } from 'layout';

import type { AddressFullType } from 'types';

import './CheckoutProducts.scss';
import AddressInfo from '../AddressInfo';

type PropsType = {
  addressFull: AddressFullType,
  receiverName: string,
  email: string,
  replaceAddress: () => void,
  isLoadingReplaceAddressButton: boolean,
};

const CheckoutProducts = ({
  addressFull,
  receiverName,
  email,
  replaceAddress,
  isLoadingReplaceAddressButton,
}: PropsType) => (
  <Row>
    <Col size={12}>
      <div styleName="container">
        <div styleName="infoContainer">
          <Row>
            <Col size={12} smVisible>
              <div styleName="header">
                <div styleName="title">Summary</div>
                <div styleName="wrapperAddressButton">
                  <div styleName="containerAddressButton">
                    <Button
                      big
                      contour
                      onClick={replaceAddress}
                      type="button"
                      dataTest="changeAddress"
                      isLoading={isLoadingReplaceAddressButton}
                    >
                      <span>Replace address</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
            <Col size={12}>
              {addressFull.value && (
                <div styleName="addressInfoWrapper">
                  <AddressInfo
                    addressFull={addressFull}
                    receiverName={receiverName}
                    email={email}
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
                  onClick={replaceAddress}
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
