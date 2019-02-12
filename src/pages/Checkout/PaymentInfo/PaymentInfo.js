// @flow

import React, { PureComponent, Fragment } from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';
import QRCode from 'qrcode.react';
// import moment from 'moment';
import { map, pathOr } from 'ramda';
import classNames from 'classnames';
import { withRouter, Link } from 'found';

import { formatPrice } from 'utils';
import { RecalcInvoiceAmountMutation } from 'relay/mutations';

import { NotificationBlock } from 'components/NotificationBlock';
import CartRest from 'pages/common/CartRest';

import type { OrderStatusType } from 'types';
import type {
  RecalcInvoiceAmountMutationVariablesType,
  RecalcInvoiceAmountMutationResponseType,
  MutationParamsType,
} from 'relay/mutations/RecalcInvoiceAmountMutation';

import type {
  OrderState as OrderStateType,
  PaymentInfo_me as PaymentInfoMeType,
} from './__generated__/PaymentInfo_me.graphql';

import './PaymentInfo.scss';

import t from './i18n';

type PropsType = {
  invoiceId: string,
  me: PaymentInfoMeType,
  relay: {
    refetch: Function,
    environment: Environment,
  },
  restCartCount?: number,
  orderState: ?OrderStatusType,
};

type StateType = {
  // priceReservedDueDateTime: ?string,
  // timerValue: string,
  isFirstRefetch: boolean,
  isNotificationActive: boolean,
};

class PaymentInfo extends PureComponent<PropsType, StateType> {
  // static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
  //   const priceReservedDueDateTime = pathOr(
  //     null,
  //     ['invoice', 'priceReservedDueDateTime'],
  //     nextProps.me,
  //   );
  //
  //   if (priceReservedDueDateTime && !prevState.priceReservedDueDateTime) {
  //     return { priceReservedDueDateTime };
  //   }
  //
  //   return null;
  // }

  constructor(props) {
    super(props);

    this.state = {
      // priceReservedDueDateTime: null,
      // timerValue: '',
      isFirstRefetch: true,
      isNotificationActive: true,
    };
  }

  componentDidMount() {
    this.unmounted = false;
    // this.updateCountdown();
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

    // $FlowIgnoreMe
    const state = pathOr(null, ['invoice', 'state'], this.props.me);

    if (state === 'AMOUNT_EXPIRED') {
      this.recalculateAmount(this.refetchInvoice);
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
        this.setState({ isFirstRefetch: false });
      },
      { force: true },
    );
  };

  recalculateAmount = (callback: (success: boolean) => void) => {
    const variables: RecalcInvoiceAmountMutationVariablesType = {
      id: this.props.invoiceId,
    };

    const params: MutationParamsType = {
      ...variables,
      environment: this.props.relay.environment,
      onCompleted: (
        response: ?RecalcInvoiceAmountMutationResponseType,
        errors: ?Array<Error>, // eslint-disable-line
      ) => {
        callback(!!response);
      },
      // eslint-disable-next-line
      onError: (error: Error) => {
        callback(false);
      },
    };

    RecalcInvoiceAmountMutation.commit(params);
  };

  // updateCountdown = () => {
  //   const { priceReservedDueDateTime } = this.state;
  //
  //   if (this.unmounted) {
  //     return;
  //   }
  //
  //   if (!priceReservedDueDateTime) {
  //     this.setState({ timerValue: '-' }, () => {
  //       setTimeout(this.updateCountdown, 1000);
  //     });
  //     return;
  //   }
  //
  //   const diff = moment(priceReservedDueDateTime)
  //     .utc()
  //     .diff(moment().utc(), 's');
  //   if (!diff || diff < 0) {
  //     this.setState({ timerValue: '-' }, () => {
  //       setTimeout(this.updateCountdown, 1000);
  //     });
  //     return;
  //   }
  //
  //   const minutes = parseInt(diff / 60, 10); // JS, I hate you
  //   const seconds = diff - minutes * 60;
  //   this.setState(
  //     { timerValue: `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}` },
  //     () => {
  //       setTimeout(this.updateCountdown, 1000);
  //     },
  //   );
  // };

  stateToString = (state: OrderStateType): string => {
    switch (state) {
      case 'TRANSACTION_PENDING':
        return 'In process';
      case 'PAYMENT_AWAITED':
        return 'Payment awaited';
      default:
        return '';
    }
  };

  handleHideNotification = (): void => {
    this.setState({ isNotificationActive: false });
  };

  renderLinks = () => (
    <div styleName="links">
      <div>
        You can pay with{' '}
        <a
          href="https://turewallet.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Storiqa Wallet
        </a>
      </div>
      <div>
        Don’t you have one yet?{' '}
        <a
          href="https://itunes.apple.com/ru/app/ture/id1448865994?mt=8"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download
        </a>
      </div>
    </div>
  );

  render() {
    const { restCartCount, orderState } = this.props;
    const { isFirstRefetch, isNotificationActive } = this.state;
    if (isFirstRefetch) {
      return (
        <div styleName="container">
          <div styleName="title">Payment</div>
          <div styleName="info">
            <div styleName="loader" />
          </div>
          <div styleName="separator" />
          {this.renderLinks()}
        </div>
      );
    }
    // $FlowIgnoreMe;
    const invoice = pathOr(null, ['me', 'invoice'], this.props);
    if (!invoice || (orderState && orderState === 'AMOUNT_EXPIRED')) {
      return (
        <div styleName="container" data-test="PAYMENT_INFO_FAILED">
          <div>
            <div styleName="title">Error</div>
            <div styleName="description">Your payment was failed :(</div>
          </div>
          <div styleName="separator" />
          {this.renderLinks()}
        </div>
      );
    }

    let wallet;
    let amount;
    let amountCaptured;
    let transactions;
    let state: ?OrderStateType;

    if (invoice) {
      ({ wallet, amount, transactions, amountCaptured } = invoice);
      ({ state } = invoice);
    }

    const dataTest =
      state === 'NEW' || state === 'PAYMENT_AWAITED' || state === 'PAID'
        ? state
        : '';
    return (
      <div styleName="container" data-test={`PAYMENT_INFO_${dataTest}`}>
        {state !== 'PAID' && <div styleName="title">Payment</div>}
        <div styleName="info">
          {(state === 'NEW' || state === 'AMOUNT_EXPIRED') && (
            <div styleName="loader" />
          )}
          {wallet &&
            amount &&
            (state === 'TRANSACTION_PENDING' ||
              state === 'PAYMENT_AWAITED') && (
              <Fragment>
                <div styleName="paymentInfoWrapper">
                  <div styleName="qr">
                    <QRCode
                      value={`${
                        invoice.currency === 'BTC' ? 'bitcoin' : 'ethereum'
                      }:${wallet}?amount=${amount}`}
                      renderAs="svg"
                      size={165}
                    />
                  </div>
                  <div styleName="paymentInfo">
                    <div styleName="addressTitle">Address</div>
                    <div styleName="address">{wallet}</div>
                    <div styleName="amountTitle">Amount</div>
                    <div styleName="amount">
                      <strong>{`${formatPrice(amount)} ${
                        invoice.currency
                      }`}</strong>
                    </div>
                    <div styleName="amountTitle">Amount captured</div>
                    <div styleName="amount">
                      {`${formatPrice(amountCaptured)} ${invoice.currency}`}
                    </div>
                  </div>
                </div>
                <div styleName="transactionsBlock">
                  <div styleName="statusBlock">
                    <div styleName="statusTitle">Payment status</div>
                    <div
                      styleName={classNames('statusValue', {
                        statusInProcess: state === 'TRANSACTION_PENDING',
                        statusPaymentAwaited: state === 'PAYMENT_AWAITED',
                      })}
                    >
                      {this.stateToString(state)}
                      <div styleName="loader-small" />
                    </div>
                  </div>
                  {transactions &&
                    transactions.length > 0 && (
                      <div styleName="transactions">
                        <div styleName="row">
                          <div styleName="transactions-title-tx">
                            Transaction ID
                          </div>
                          <div styleName="transactions-title-amount">
                            Amount
                          </div>
                        </div>
                        {map(
                          (item: { id: string, amount: number }) => (
                            <div key={item.id} styleName="row">
                              <div styleName="row-tx">
                                <a
                                  href={`https://etherscan.io/tx/${item.id}`}
                                  target="_blank"
                                >
                                  {item.id}
                                </a>
                              </div>
                              <div styleName="row-amount">
                                {item.amount} STQ
                              </div>
                            </div>
                          ),
                          transactions,
                        )}
                      </div>
                    )}
                </div>
                <div styleName="reserveInfo">
                  The order must be paid in three days after creation.
                </div>
              </Fragment>
            )}
          {state === 'PAID' && (
            <div>
              <div styleName="title">Success</div>
              <div styleName="description">
                Your payment was successfully completed.
              </div>
              {Boolean(restCartCount) &&
                restCartCount !== 0 && (
                  <div styleName="restCartInfo">
                    <CartRest count={restCartCount} cartType="fiat" />
                  </div>
                )}
              <div styleName="ordersLinkWrap">
                <Link to="/profile/orders" styleName="ordersLink">
                  {t.myOrders}
                </Link>
              </div>
            </div>
          )}
        </div>
        <div styleName="separator" />
        {this.renderLinks()}
        {isNotificationActive ? (
          <div styleName="notification">
            <NotificationBlock
              type="warning"
              title={t.attention}
              longText
              text={t.exchangeNotification}
              link={{ text: t.ok }}
              onClick={this.handleHideNotification}
              hideCloseButton
            />
          </div>
        ) : null}
      </div>
    );
  }
}

// export default createRefetchContainer;

export default createRefetchContainer(
  withRouter(PaymentInfo),
  graphql`
    fragment PaymentInfo_me on User
      @argumentDefinitions(id: { type: "String!", defaultValue: "" }) {
      invoice(id: $id) {
        id
        amount
        amountCaptured
        priceReservedDueDateTime
        state
        wallet
        transactions {
          id
          amount
        }
        currency
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
