// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr } from 'ramda';

import { Page } from 'components/App';
import { PaymentInfo } from 'pages/Checkout/PaymentInfo';
import { PaymentInfoFiat } from 'pages/Checkout/PaymentInfoFiat';

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

    if (!invoice.id || !currency) {
      return null;
    }

    // $FlowIgnoreMe
    const orderSlug = pathOr(null, ['order', 'slug'], me);
    // $FlowIgnoreMe
    const paymentIntent = pathOr(
      null,
      ['order', 'invoice', 'paymentIntent'],
      me,
    );

    return paymentIntent ? (
      <PaymentInfoFiat invoice={invoice} me={me} orderSlug={orderSlug} />
    ) : (
      <PaymentInfo invoiceId={invoice.id} me={me} />
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
        slug
        currency
        invoice {
          id
          amount
          currency
          paymentIntent {
            id
            clientSecret
          }
        }
      }
    }
  `,
);
