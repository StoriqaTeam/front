// @flow

import React, { PureComponent, Fragment } from 'react';
import { routerShape, withRouter } from 'found';

import type { OrderStatusType } from 'types';

import { Stripe } from '../Stripe';

import './PaymentInfoFiat.scss';

import t from './i18n';

type PropsType = {
  me: {
    email: string,
    firstName: string,
    lastName: string,
  },
  router: routerShape,
  invoice: ?{
    id: string,
    amount: number,
    currency: string,
    priceReservedDueDateTime: string,
    state: OrderStatusType,
    wallet: ?string,
    transactions: Array<{
      id: string,
      amount: number,
    }>,
    orders: Array<{
      id: string,
      slug: number,
      productId: number,
      quantity: number,
      price: number,
    }>,
  },
};

type StateType = {
  paidComplete: boolean,
};

class PaymentInfoFiat extends PureComponent<PropsType, StateType> {
  // constructor(props) {
  //   super(props);
  //
  //   console.log('---props', props);
  // }

  state = {
    paidComplete: false,
  };

  componentWillUnmount() {
    if (this.paidTimer) {
      clearTimeout(this.paidTimer);
    }
  }

  paidTimer: TimeoutID;

  handlePaid = () => {
    this.setState({ paidComplete: true }, () => {
      if (this.paidTimer) {
        clearTimeout(this.paidTimer);
      }
      this.paidTimer = setTimeout(() => {
        this.props.router.push('/profile/orders');
      }, 2000);
    });
  };

  render() {
    // console.log('---this.props', this.props);
    const { invoice, me } = this.props;
    if (!invoice) {
      return (
        <div styleName="container" data-test="PAYMENT_INFO_FAILED">
          <div styleName="wrap">
            <div styleName="title">{t.error}</div>
            <div styleName="description">{t.yourPaymentWasFailed}</div>
            <div styleName="fiat">
              <Stripe
                amount={100500}
                currency="USD"
                email="a.levenec@gmail.com"
                name="Aleksey Levenets"
                onPaid={() => {}}
              />
            </div>
          </div>
        </div>
      );
    }

    const { state, amount, currency } = invoice;
    const { paidComplete } = this.state;
    const dataTest =
      state === 'NEW' || state === 'PAYMENT_AWAITED' || state === 'PAID'
        ? state
        : '';

    return (
      <div styleName="container" data-test={`PAYMENT_INFO_${dataTest}`}>
        <div styleName="wrap">
          <div styleName="info">
            {!paidComplete ? (
              <Fragment>
                <div styleName="title">{t.payment}</div>
                <div styleName="description">{t.someDescription}</div>
                <div styleName="fiat">
                  <Stripe
                    amount={amount}
                    currency={currency}
                    email={me.email}
                    name={`${me.firstName} ${me.lastName}`}
                    onPaid={this.handlePaid}
                  />
                </div>
              </Fragment>
            ) : (
              <div>
                <div styleName="title">{t.success}</div>
                <div styleName="description">
                  {t.yourPaymentWasSuccessfullyCompleted}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(PaymentInfoFiat);
