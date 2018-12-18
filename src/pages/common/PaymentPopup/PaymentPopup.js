// @flow

import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import moment from 'moment';

import { Modal } from 'components/Modal';
import { SpinnerButton } from 'components/common/SpinnerButton';

import './PaymentPopup.scss';

import t from './i18n';

type PropsType = {
  onCloseClicked: () => void,
  isShown: boolean,
  walletAddress: string,
  amount: number,
  reservedDueDate: string,
};

type StateType = {
  isPaymentStatusShown: boolean,
  timerValue: string,
};

class PaymentPopup extends Component<PropsType, StateType> {
  state: StateType = {
    isPaymentStatusShown: false,
    timerValue: '',
  };

  componentDidMount() {
    this.unmounted = false;
    this.updateCountdown();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  unmounted: boolean = true;

  updateCountdown = () => {
    if (this.unmounted) {
      return;
    }

    const diff = moment(this.props.reservedDueDate)
      .utc()
      .diff(moment().utc(), 's');
    if (!diff || diff < 0) {
      this.setState({ timerValue: '-' }, () => {
        setTimeout(this.updateCountdown, 1000);
      });
      return;
    }

    const minutes = parseInt(diff / 60, 10); // JS, I hate you
    const seconds = diff - minutes * 60;
    this.setState(
      { timerValue: `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}` },
      () => {
        setTimeout(this.updateCountdown, 1000);
      },
    );
  };

  render() {
    const { isShown, onCloseClicked, walletAddress, amount } = this.props;

    return (
      <Modal showModal={isShown} onClose={onCloseClicked}>
        <div styleName="container">
          {this.state.isPaymentStatusShown && (
            <div styleName="paymentStatusContainer">
              <div styleName="loader" />
              <span styleName="description">
                {t.processingYourPayment}
                <br />
                {t.pleaseWaitForAwhile}
              </span>
              {/* eslint-disable */}
              <div
                styleName="close"
                onClick={() => this.setState({ isPaymentStatusShown: false })}
              >
                {t.close}
              </div>
              {/* eslint-enable */}
            </div>
          )}
          <div styleName="title">{t.payment}</div>
          <div styleName="description">
            {t.scanQRCodeWithinYourWalletApp}
            <br />
            {t.andPayInSeconds}
          </div>
          <div styleName="paymentInfoWrapper">
            <QRCode
              value={`ethereum:${walletAddress}amount=${amount}`}
              renderAs="svg"
              size={200}
            />
            <div styleName="paymentInfo">
              <div styleName="addressTitle">{t.address}</div>
              <div styleName="address">{walletAddress}</div>
              <div styleName="amountTitle">{t.amount}</div>
              <div styleName="amount">{amount} STQ</div>
              <div styleName="reserveInfo">
                {t.currentPriceReservedFor}{' '}
                <span styleName="timer">{this.state.timerValue}</span>
              </div>
            </div>
          </div>
          <div styleName="sendButtonWrapper">
            <SpinnerButton
              big
              onClick={() => this.setState({ isPaymentStatusShown: true })}
            >
              {t.iHavePaid}
            </SpinnerButton>
          </div>
        </div>
      </Modal>
    );
  }
}

export default PaymentPopup;
