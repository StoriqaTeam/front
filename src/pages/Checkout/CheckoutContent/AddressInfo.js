// @flow

import React from 'react';

import './AddressInfo.scss';

const AddressInfo = ({ receiverName, addressFull, email }) => (
  <div styleName="infoContent">
    <div>
      {addressFull.country},{' '}
      {addressFull.locality}
    </div>
    <div>{addressFull.value}</div>
    <div styleName="name">
      {receiverName}
    </div>
    <div styleName="email">{email}</div>
  </div>
);

export default AddressInfo;
