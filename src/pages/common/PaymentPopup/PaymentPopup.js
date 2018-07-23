// @flow

import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import moment from 'moment';

import { Modal } from 'components/Modal';
import { SpinnerButton } from 'components/common/SpinnerButton';

import './PaymentPopup.scss';

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
                Processing your payment.<br />Plase wait for a while.
              </span>
              {/* eslint-disable */}
              <div
                styleName="close"
                onClick={() => this.setState({ isPaymentStatusShown: false })}
              >
                Close
              </div>
              {/* eslint-enable */}
            </div>
          )}
          <div styleName="title">Payment</div>
          <div styleName="description">
            Scan QR-code within your wallet app<br />and pay in a seconds
          </div>
          <div styleName="paymentInfoWrapper">
            <QRCode
              value={`ethereum:${walletAddress}[?gas=21000][?value=${amount}]`}
              renderAs="svg"
              size={200}
            />
            <div styleName="paymentInfo">
              <div styleName="addressTitle">Address</div>
              <div styleName="address">{walletAddress}</div>
              <div styleName="amountTitle">Amount</div>
              <div styleName="amount">{amount} STQ</div>
              <div styleName="reserveInfo">
                Current price reserved for{' '}
                <span styleName="timer">{this.state.timerValue}</span>
              </div>
            </div>
          </div>
          <div styleName="sendButtonWrapper">
            <SpinnerButton
              big
              onClick={() => this.setState({ isPaymentStatusShown: true })}
            >
              I have paid
            </SpinnerButton>
          </div>
        </div>
      </Modal>
    );
  }
}

export default PaymentPopup;
