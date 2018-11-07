// @flow strict

import React from 'react';

import { setRegion } from './utils';

import './OrderInvoice.scss';

type PropsType = $Shape<{
  value: ?string,
  country: ?string,
  administrativeAreaLevel1: ?string,
  administrativeAreaLevel2: ?string,
  locality: ?string,
  political: ?string,
  postalCode: ?string,
  route: ?string,
  streetNumber: ?string,
  placeId: ?string,
  email: ?string,
  phone: ?string,
}>;

const OrderInvoiceData = ({
  value,
  country,
  administrativeAreaLevel1,
  administrativeAreaLevel2,
  locality,
  political,
  postalCode,
  streetNumber,
  email,
  phone,
}: PropsType) => {
  const region = setRegion(administrativeAreaLevel1, administrativeAreaLevel2);
  return (
    <div styleName="address">
      <div styleName="addressField">
        <span>Postal Code:</span> <span>{postalCode}</span>
      </div>
      <div styleName="addressField">
        <span>Country:</span> <span>{country}</span>
      </div>
      <div styleName="addressField">
        <span>Region:</span> <span> {region}</span>
      </div>
      <div styleName="addressField">
        <span>City:</span> <span>{locality}</span>
      </div>
      <div styleName="addressField">
        <span>Area/District:</span> <span> {political}</span>
      </div>
      <div styleName="addressField">
        <span>Street:</span> <span> {value}</span>
      </div>
      <div styleName="addressField">
        <span>Apt/Suite/Other:</span> <span> {streetNumber}</span>
      </div>
      <div styleName="addressField">
        <span>Email:</span> <span> {email}</span>
      </div>
      <div styleName="addressField">
        <span>Phone Number:</span> <span> {phone}</span>
      </div>
    </div>
  );
};

export default OrderInvoiceData;
