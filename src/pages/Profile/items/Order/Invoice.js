// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr } from 'ramda';

import { Page } from 'components/App';
import { PaymentInfo } from 'pages/Checkout/PaymentInfo';

import type { Invoice_me as InvoiceMeType } from './__generated__/Invoice_me.graphql';

type PropsType = {
  me: InvoiceMeType,
};

class Invoice extends PureComponent<PropsType> {
  componentDidMount() {
    window.scroll({ top: 0 });
  }

  render() {
    console.log('---this.props', this.props);
    // $FlowIgnoreMe
    const invoiceId = pathOr(null, ['order', 'invoice', 'id'], this.props.me);
    if (!invoiceId) {
      return null;
    }
    return <PaymentInfo invoiceId={invoiceId} me={this.props.me} />;
  }
}

export default createFragmentContainer(
  Page(Invoice),
  graphql`
    fragment Invoice_me on User
      @argumentDefinitions(slug: { type: "Int!", defaultValue: 0 }) {
      ...PaymentInfo_me
      order(slug: $slug) {
        invoice {
          id
        }
      }
    }
  `,
);
