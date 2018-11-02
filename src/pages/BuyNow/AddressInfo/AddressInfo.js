// @flow strict

import React from 'react';

import type { AddressFullType } from 'types';

import './AddressInfo.scss';

type PropsType = {
  receiverName: string,
  addressFull: AddressFullType,
  email: string,
};

const AddressInfo = ({ receiverName, addressFull, email }: PropsType) => (
  <div styleName="infoContent">
    <div styleName="wrapper">
      <div styleName="label">Delivery address</div>
      <div>
        {addressFull.country}, {addressFull.locality}
      </div>
      <div>{addressFull.value}</div>
      <div>{addressFull.postalCode}</div>
    </div>
    <div styleName="label">Name</div>
    <div styleName="name">{receiverName}</div>
    <div styleName="email">{email}</div>
  </div>
);

export default AddressInfo;
