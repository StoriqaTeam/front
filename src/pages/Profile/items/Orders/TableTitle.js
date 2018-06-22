// @flow

import React from 'react';

import './TableTitle.scss';

const TableTitle = () => (
  <div styleName="container">
    <span styleName="cellNumber">Number</span>
    <span styleName="cellDate">Date</span>
    <span styleName="cellShop">Shop</span>
    <span styleName="cellDelivery">Delivery</span>
    <span styleName="cellItems">Items</span>
    <span styleName="cellPrice">Price</span>
    <span styleName="cellPayment">Payment</span>
    <span styleName="cellStatus">Status</span>
  </div>
);

export default TableTitle;
