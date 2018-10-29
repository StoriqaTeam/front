// @flow strict

import React from 'react';

import { setRegion } from './utils';

import '../OrderInvoice.scss';

import t from './i18n';

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
        <span>{t.postalCode}:</span> <span>{postalCode}</span>
      </div>
      <div styleName="addressField">
        <span>{t.country}:</span> <span>{country}</span>
      </div>
      <div styleName="addressField">
        <span>{t.region}:</span> <span> {region}</span>
      </div>
      <div styleName="addressField">
        <span>{t.city}:</span> <span>{locality}</span>
      </div>
      <div styleName="addressField">
        <span>{t.areaDistrict}:</span> <span> {political}</span>
      </div>
      <div styleName="addressField">
        <span>{t.street}:</span> <span> {value}</span>
      </div>
      <div styleName="addressField">
        <span>{t.aptSuiteOther}:</span> <span> {streetNumber}</span>
      </div>
      <div styleName="addressField">
        <span>{t.email}:</span> <span> {email}</span>
      </div>
      <div styleName="addressField">
        <span>{t.phoneNumber}:</span> <span> {phone}</span>
      </div>
    </div>
  );
};

export default OrderInvoiceData;
