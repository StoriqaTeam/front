// @flow

import React, { PureComponent, Fragment } from 'react';
import { withRouter, Link } from 'found';

import CartRest from 'pages/common/CartRest';

import type { OrderStatusType, PaymentIntentStatusesType } from 'types';

import { Stripe } from '../Stripe';

import './PaymentInfoFiat.scss';

import t from './i18n';

type PropsType = {
  me: {
    email: string,
    firstName: string,
    lastName: string,
  },
  invoice: {
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
    paymentIntent: {
      id: string,
      clientSecret: string,
      status: PaymentIntentStatusesType,
    },
  },
  restCartCount?: number,
  orderState: ?OrderStatusType,
};

type StateType = {
  paidComplete: boolean,
};

class PaymentInfoFiat extends PureComponent<PropsType, StateType> {
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
      // if (this.paidTimer) {
      //   clearTimeout(this.paidTimer);
      // }
      // this.paidTimer = setTimeout(() => {
      //   const { orderSlug } = this.props;
      //   if (orderSlug != null) {
      //     this.props.router.push(`/profile/orders/${orderSlug}`);
      //   }
      // }, 2000);
    });
  };

  render() {
    const { invoice, me, restCartCount, orderState } = this.props;
    const { paymentIntent } = invoice;
    if (
      !invoice ||
      !paymentIntent ||
      (orderState && orderState === 'AMOUNT_EXPIRED')
    ) {
      return (
        <div styleName="container" data-test="PAYMENT_INFO_FAILED">
          <div styleName="wrap">
            <div styleName="title">{t.error}</div>
            <div styleName="description">{t.yourPaymentWasFailed}</div>
          </div>
        </div>
      );
    }

    if (paymentIntent && paymentIntent.status === 'SUCCEEDED') {
      return (
        <div styleName="container" data-test="PAYMENT_INFO_ALREADY_PAID">
          <div styleName="wrap">
            <div styleName="title">{t.success}</div>
            <div styleName="description">{t.alreadyPaid}</div>
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
                <div styleName="fiat">
                  <Stripe
                    paymentIntent={paymentIntent}
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
                {Boolean(restCartCount) &&
                  restCartCount !== 0 && (
                    <div styleName="restCartInfo">
                      <CartRest count={restCartCount} cartType="crypto" />
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
        </div>
      </div>
    );
  }
}

export default withRouter(PaymentInfoFiat);
