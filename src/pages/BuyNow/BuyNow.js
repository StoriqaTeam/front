// @flow

import React, { Component } from 'react';

import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { CheckoutHeader } from 'pages/Checkout/CheckoutHeader';
import CheckoutAddress from 'pages/Checkout/CheckoutContent/CheckoutAddress';
import CheckoutSidebar from 'pages/Checkout/CheckoutSidebar';
import { StickyBar } from 'components/StickyBar';
import { log } from 'utils';

type PropsType = {
  //
};

type StateType = {
  checkoutInProcess: boolean,
  // invoiceId: ?number,
};

class BuyNow extends Component<PropsType, StateType> {
  state = {
    checkoutInProcess: false,
    // invoiceId: null,
  };

  checkReadyToCheckout = (): boolean => true;

  handleChangeStep = (step: number) => {
    log.debug('handleChangeStep', step);
  };

  handleChangeSaveCheckbox = () => {};

  handleOnChangeAddressType = () => {};

  handleOnChangeOrderInput = () => {};

  handleCheckout = () => {};

  render() {
    const emptyCart = false;
    const step = 1;
    const me = {};
    const isAddressSelect = false;
    const isNewAddress = false;
    const saveAsNewAddress = false;
    const deliveryAddresses = [];
    const orderInput = {};
    const stores = [];

    return (
      <div styleName="mainContainer">
        <Container withoutGrow>
          <Row withoutGrow>
            {(!emptyCart || step === 3) && (
              <Col size={12}>
                <div styleName="headerWrapper">
                  <CheckoutHeader
                    currentStep={step}
                    isReadyToNext={this.checkReadyToCheckout()}
                    onChangeStep={this.handleChangeStep}
                  />
                </div>
              </Col>
            )}
            <Col size={12}>
              <div>
                <Row withoutGrow>
                  <Col
                    size={12}
                    lg={step !== 3 ? 8 : 12}
                    xl={step !== 3 ? 9 : 12}
                  >
                    {step === 1 && (
                      <div styleName="wrapper">
                        <div styleName="container addressContainer">
                          <CheckoutAddress
                            me={me}
                            isAddressSelect={isAddressSelect}
                            isNewAddress={isNewAddress}
                            saveAsNewAddress={saveAsNewAddress}
                            onChangeSaveCheckbox={this.handleChangeSaveCheckbox}
                            onChangeAddressType={this.handleOnChangeAddressType}
                            deliveryAddresses={deliveryAddresses || []}
                            orderInput={orderInput}
                            onChangeOrderInput={this.handleOnChangeOrderInput}
                          />
                        </div>
                      </div>
                    )}
                    {step === 2 && (
                      <div styleName="wrapper">
                        <div styleName="container">
                          <CheckoutProducts
                            me={me}
                            orderInput={orderInput}
                            onChangeStep={this.handleChangeStep}
                          />
                        </div>
                        <div styleName="storeContainer">
                          {stores.map(store => (
                            <CartStore
                              onlySelected
                              unselectable
                              key={store.__id} // eslint-disable-line
                              store={store}
                              totals={1000}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {/* step === 3 &&
                      this.state.invoiceId && (
                        <PaymentInfo
                          invoiceId={this.state.invoiceId}
                          me={this.props.me}
                        />
                      ) */}
                  </Col>
                  {!emptyCart &&
                    step !== 3 && (
                      <Col size={12} lg={4} xl={3}>
                        <StickyBar>
                          <CheckoutSidebar
                            buttonText={step === 1 ? 'Next' : 'Checkout'}
                            onClick={
                              (step === 1 && this.handleChangeStep(2)) ||
                              this.handleCheckout
                            }
                            isReadyToClick={this.checkReadyToCheckout()}
                            checkoutInProcess={this.state.checkoutInProcess}
                          />
                        </StickyBar>
                      </Col>
                    )}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Page(BuyNow, true, true);
