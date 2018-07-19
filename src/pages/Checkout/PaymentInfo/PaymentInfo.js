// @flow

import React, { PureComponent, Fragment } from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import QRCode from 'qrcode.react';
import moment from 'moment';
import { pathOr } from 'ramda';

import type {
  OrderState as OrderStateType,
  PaymentInfo_me as PaymentInfoMeType,
} from './__generated__/PaymentInfo.graphql';

import './PaymentInfo.scss';

type PropsType = {
  invoiceId: string,
  me: PaymentInfoMeType,
  relay: {
    refetch: Function,
  },
};

type StateType = {
  timerValue: string,
};

class PaymentInfo extends PureComponent<PropsType, StateType> {
  state: StateType = {
    timerValue: '',
  };

  componentDidMount() {
    this.unmounted = false;
    this.updateCountdown();
    this.refetchInvoice();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  unmounted: boolean = true;

  refetchInvoice = () => {
    if (
      this.unmounted ||
      !this.props.invoiceId ||
      this.props.invoiceId === ''
    ) {
      return;
    }

    this.props.relay.refetch(
      {
        id: this.props.invoiceId,
      },
      null,
      () => {
        setTimeout(() => {
          this.refetchInvoice();
        }, 5000);
      },
      { force: true },
    );
  };

  updateCountdown = () => {
    const priceReservedDueDateTime = pathOr(
      null,
      ['invoice', 'priceReservedDueDateTime'],
      this.props.me,
    );
    if (this.unmounted || !priceReservedDueDateTime) {
      return;
    }

    const diff = moment(priceReservedDueDateTime)
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
    console.log({ props: this.props });
    // $FlowIgnoreMe;
    const invoice = pathOr(null, ['me', 'invoice'], this.props);
    if (!invoice) {
      return <div>no data</div>;
    }

    const { wallet, amount, transactionId } = invoice;
    return (
      <div styleName="container">
        <div styleName="title">Payment</div>
        <div styleName="description">
          Please wait until payment data<br />will be uploaded
        </div>
        <div styleName="info">
          {wallet ? (
            <Fragment>
              <div styleName="paymentInfoWrapper">
                <div styleName="qr">
                  <QRCode
                    value={`ethereum:${wallet}[?gas=21000][?value=${amount}]`}
                    renderAs="svg"
                    size={165}
                  />
                </div>
                <div styleName="paymentInfo">
                  <div styleName="addressTitle">Address</div>
                  <div styleName="address">{wallet}</div>
                  <div styleName="amountTitle">Amount</div>
                  <div styleName="amount">{amount} STQ</div>
                  <div styleName="reserveInfo">
                    Current price reserved for{' '}
                    <span styleName="timer">{this.state.timerValue}</span>
                  </div>
                </div>
              </div>
              {transactionId && (
                <div styleName="transactionsBlock">
                  <div styleName="statusBlock">
                    <div styleName="statusTitle">Payment status</div>
                    <div styleName="statusValue">In process</div>
                  </div>
                  <div styleName="transactions" />
                </div>
              )}
            </Fragment>
          ) : (
            <div styleName="loader" />
          )}
        </div>
        <div styleName="separator" />
        <div styleName="links">
          <div>
            You can pay with <span>Storiqa Wallet</span>
          </div>
          <div>
            Don’t you have one yet? <span>Download</span>
          </div>
        </div>
      </div>
    );
  }
}

export default createRefetchContainer(
  PaymentInfo,
  graphql`
    fragment PaymentInfo_me on User
      @argumentDefinitions(id: { type: "String!", defaultValue: "" }) {
      invoice(id: $id) {
        id
        amount
        priceReservedDueDateTime
        state
        wallet
        transactionId
        transactionCapturedAmount
      }
    }
  `,
  graphql`
    query PaymentInfo_Query($id: String!) {
      me {
        ...PaymentInfo_me @arguments(id: $id)
      }
    }
  `,
);
