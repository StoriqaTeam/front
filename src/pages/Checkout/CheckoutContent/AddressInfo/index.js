// @flow

import React from 'react';

import './AddressInfo.scss';

import t from './i18n';

export type AddressFullType = {
  value?: ?string,
  country?: ?string,
  administrativeAreaLevel1?: ?string,
  administrativeAreaLevel2?: ?string,
  locality?: ?string,
  political?: ?string,
  postalCode?: ?string,
  route?: ?string,
  streetNumber?: ?string,
  placeId?: ?string,
};

type PropsType = {
  receiverName: string,
  addressFull: AddressFullType,
  email: string,
};

const AddressInfo = ({ receiverName, addressFull, email }: PropsType) => (
  <div styleName="infoContent">
    <div styleName="wrapper">
      <div styleName="label">{t.deliveryAddress}</div>
      <div>
        {addressFull.country}, {addressFull.locality}
      </div>
      <div>{addressFull.value}</div>
      <div>{addressFull.postalCode}</div>
    </div>
    <div styleName="label">{t.name}</div>
    <div styleName="name">{receiverName}</div>
    <div styleName="email">{email}</div>
  </div>
);

export default AddressInfo;
