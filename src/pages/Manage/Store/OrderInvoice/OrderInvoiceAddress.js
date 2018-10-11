// @flow strict

import React from 'react';

import './OrderInvoice.scss';

const OrderInvoiceData = () => (
  <div styleName="address">
    <div styleName="addressField">
      <span>Postal Code:</span> <span>760001</span>
    </div>
    <div styleName="addressField">
      <span>Country #:</span> <span>Russia</span>
    </div>
    <div styleName="addressField">
      <span>Region:</span> <span>Moscow</span>
    </div>
    <div styleName="addressField">
      <span>Locality:</span> <span>Moscow</span>
    </div>
    <div styleName="addressField">
      <span>Area/District:</span> <span>Some district</span>
    </div>
    <div styleName="addressField">
      <span>Street:</span> <span>Семёносвкая 1</span>
    </div>
    <div styleName="addressField">
      <span>Apt/Suite/Other:</span> <span>30</span>
    </div>
    <div styleName="addressField">
      <span>Email:</span> <span>stq@storiqa.com</span>
    </div>
    <div styleName="addressField">
      <span>Phone Number:</span> <span>+7123456789</span>
    </div>
  </div>
);

export default OrderInvoiceData;
