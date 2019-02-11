// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr } from 'ramda';

import { Page } from 'components/App';
import { PaymentInfo } from 'pages/Checkout/PaymentInfo';
import { PaymentInfoFiat } from 'pages/Checkout/PaymentInfoFiat';
import { checkCurrencyType } from 'utils';

import type { Invoice_me as InvoiceMeType } from './__generated__/Invoice_me.graphql';

type PropsType = {
  me: InvoiceMeType,
};

class Invoice extends PureComponent<PropsType> {
  componentDidMount() {
    window.scroll({ top: 0 });
  }

  render() {
    const { me } = this.props;
    // $FlowIgnoreMe
    const invoice = pathOr(null, ['order', 'invoice'], me);
    // $FlowIgnoreMe
    const currency = pathOr(null, ['order', 'currency'], me);

    if (!invoice || !invoice.id || !currency) {
      return null;
    }

    // $FlowIgnoreMe
    const orderSlug = pathOr(null, ['order', 'slug'], me);
    // $FlowIgnoreMe
    const orderState = pathOr(null, ['order', 'state'], me);

    return checkCurrencyType(currency) === 'fiat' ? (
      <PaymentInfoFiat
        invoice={invoice}
        me={me}
        orderSlug={orderSlug}
        orderState={orderState}
      />
    ) : (
      <PaymentInfo invoiceId={invoice.id} me={me} orderState={orderState} />
    );
  }
}

export default createFragmentContainer(
  Page(Invoice),
  graphql`
    fragment Invoice_me on User
      @argumentDefinitions(slug: { type: "Int!", defaultValue: 0 }) {
      ...PaymentInfo_me
      email
      firstName
      lastName
      order(slug: $slug) {
        state
        slug
        currency
        invoice {
          id
          amount
          currency
          paymentIntent {
            id
            clientSecret
            status
          }
          state
        }
      }
    }
  `,
);
