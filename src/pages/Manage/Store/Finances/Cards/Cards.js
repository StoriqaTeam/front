// @flow strict

import React, { PureComponent } from 'react';
import { map } from 'ramda';

import { Table } from 'components/common';

import './Cards.scss';

type PropsType = {
  //
};

const cards = [
  {
    "id": "card_1Dtv992eZvKYlo2ChPMWxCDv",
    "object": "card",
    "address_city": null,
    "address_country": null,
    "address_line1": null,
    "address_line1_check": null,
    "address_line2": null,
    "address_state": null,
    "address_zip": null,
    "address_zip_check": null,
    "brand": "Visa",
    "country": "US",
    "customer": 'Aleksey Levenets',
    "cvc_check": null,
    "dynamic_last4": null,
    "exp_month": 8,
    "exp_year": 2020,
    "fingerprint": "Xt5EWLLDS7FJjR1c",
    "funding": "credit",
    "last4": "1234",
    "metadata": {},
    "name": null,
    "tokenization_method": null,
  },
  {
    "id": "card_1Dtv992eZvKYlo2ChPMWxHgY",
    "object": "card",
    "address_city": null,
    "address_country": null,
    "address_line1": null,
    "address_line1_check": null,
    "address_line2": null,
    "address_state": null,
    "address_zip": null,
    "address_zip_check": null,
    "brand": "MasterCard",
    "country": "US",
    "customer": 'Aleksey Levenets',
    "cvc_check": null,
    "dynamic_last4": null,
    "exp_month": 11,
    "exp_year": 2021,
    "fingerprint": "Xt5EWLLDS7FJjR1c",
    "funding": "credit",
    "last4": "4242",
    "metadata": {},
    "name": null,
    "tokenization_method": null,
  },
];

class Cards extends PureComponent<PropsType> {
  render() {
    return (
      <div styleName="container">
        <div styleName="cards">
          <div styleName="table">
            <Table
              columns={['Card type & number', 'Expiration date', 'Cardholder name']}
              data={map(item => [
                `•••• •••• •••• ${item.last4}`,
                `${item.exp_month}/${item.exp_year}`,
                item.customer,
              ], cards)}
            />
          </div>
          {/* map(item => (
            <div styleName="card">{item.last4}</div>
          ), cards) */}
        </div>
      </div>
    );
  }
}

export default Cards;
