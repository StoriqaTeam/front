// @flow

import React, { PureComponent, Fragment } from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';
import QRCode from 'qrcode.react';
import moment from 'moment';
import { map, pathOr } from 'ramda';
import classNames from 'classnames';
import { routerShape, withRouter } from 'found';

import { formatPrice } from 'utils';
import { RecalcInvoiceAmountMutation } from 'relay/mutations';

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

type PropsType = {
  invoiceId: string,
  me: PaymentInfoMeType,
  relay: {
    refetch: Function,
    environment: Environment,
  },
  router: routerShape,
};

type StateType = {
  timerValue: string,
  isFirstRefetch: boolean,
};

class PaymentInfo extends PureComponent<PropsType, StateType> {
  state = {
    timerValue: '',
    isFirstRefetch: true,
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

    // $FlowIgnoreMe
    const state = pathOr(null, ['invoice', 'state'], this.props.me);
    if (state === 'PAID') {
      setTimeout(() => {
        this.props.router.push('/profile/orders');
      }, 2000);
      return;
    }

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

  updateCountdown = () => {
    // $FlowIgnoreMe
    const priceReservedDueDateTime = pathOr(
      null,
      ['invoice', 'priceReservedDueDateTime'],
      this.props.me,
    );

    if (this.unmounted) {
      return;
    }

    if (!priceReservedDueDateTime) {
      this.setState({ timerValue: '-' }, () => {
        setTimeout(this.updateCountdown, 1000);
      });
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

  render() {
    const { isFirstRefetch } = this.state;
    if (isFirstRefetch) {
      return (
        <div styleName="container">
          <div styleName="title">Payment</div>
          <div styleName="description">
            Please wait until payment data<br />will be uploaded
          </div>
          <div styleName="info">
            <div styleName="loader" />
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
    // $FlowIgnoreMe;
    const invoice = pathOr(null, ['me', 'invoice'], this.props);
    if (!invoice) {
      return (
        <div styleName="container" data-test="PAYMENT_INFO_FAILED">
          <div>
            <div styleName="title">Error</div>
            <div styleName="description">Your payment was failed :(</div>
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

    let wallet;
    let amount;
    let transactions;
    let state: ?OrderStateType;

    if (invoice) {
      ({ wallet, amount, transactions } = invoice);
      // eslint-disable-next-line
      state = invoice.state;
    }

    const dataTest =
      state === 'NEW' || state === 'PAYMENT_AWAITED' || state === 'PAID'
        ? state
        : '';
    return (
      <div styleName="container" data-test={`PAYMENT_INFO_${dataTest}`}>
        {state !== 'PAID' && (
          <Fragment>
            <div styleName="title">Payment</div>
            <div styleName="description">
              Please wait until payment data<br />will be uploaded
            </div>
          </Fragment>
        )}
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
                      value={`ethereum:${wallet}?gas=21000?value=${amount}`}
                      renderAs="svg"
                      size={165}
                    />
                  </div>
                  <div styleName="paymentInfo">
                    <div styleName="addressTitle">Address</div>
                    <div styleName="address">{wallet}</div>
                    <div styleName="amountTitle">Amount</div>
                    <div styleName="amount">{formatPrice(amount)} STQ</div>
                    {
                      <div styleName="reserveInfo">
                        Current price reserved for{' '}
                        <span styleName="timer">{this.state.timerValue}</span>
                      </div>
                    }
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
              </Fragment>
            )}
          {state === 'PAID' && (
            <div>
              <div styleName="title">Success</div>
              <div styleName="description">
                Your payment was successfully completed.
              </div>
            </div>
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
  withRouter(PaymentInfo),
  graphql`
    fragment PaymentInfo_me on User
      @argumentDefinitions(id: { type: "String!", defaultValue: "" }) {
      invoice(id: $id) {
        id
        amount
        priceReservedDueDateTime
        state
        wallet
        transactions {
          id
          amount
        }
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
