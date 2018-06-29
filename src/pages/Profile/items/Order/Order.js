// @flow

import React, { PureComponent } from 'react';

import { Button } from 'components/common/Button';
import { timeFromTimestamp, fullDateFromTimestamp } from 'utils/formatDate';

import TextWithLabel from './TextWithLabel';
import ProductBlock from './ProductBlock';
import StatusList from './StatusList';
import orderMock from './order.mock';

import type { ProductDTOType } from './ProductBlock';
import type { OrderStatusType } from './StatusList';

import './Order.scss';

type OrderDTOType = {
  number: string,
  product: ProductDTOType,
  customer: {
    name: string,
    address: string,
  },
  date: string,
  delivery: string,
  trackId: string,
  quantity: number,
  subtotal: number,
  status: string,
  paymentStatus: string,
  statusHistory: Array<OrderStatusType>,
};

type PropsType = {
  // item: OrderDTOType,
};

class Order extends PureComponent<PropsType> {
  getOrderDTO = () => {
    const order: OrderDTOType = orderMock;
    return order;
  };

  getDateFromTimestamp = (timestamp: string): string =>
    fullDateFromTimestamp(timestamp);

  getTimeFromTimestamp = (timestamp: string): string =>
    timeFromTimestamp(timestamp);

  render() {
    const order = this.getOrderDTO();
    return (
      <div styleName="container">
        <div styleName="orderNumber">ORDER #{order.number}</div>
        <div styleName="statusBlock">
          <div styleName="statuses">
            <div styleName="statusTitle">Status</div>
            <div styleName="statusInfo">{order.status}</div>
            <div styleName="statusTitle secondStatusTitle">Payment status</div>
            <div styleName="statusInfo">{order.paymentStatus}</div>
          </div>
          <div styleName="buttonWrapper">
            <Button wireframe big>
              Open ticket
            </Button>
          </div>
        </div>
        <ProductBlock product={order.product} />
        <div styleName="infoBlock">
          <div styleName="left">
            <TextWithLabel label="Customer" text={order.customer.name} />
            <TextWithLabel
              label="Date"
              text={this.getDateFromTimestamp(order.date)}
            />
            <TextWithLabel label="Delivery" text={order.delivery} />
            <TextWithLabel label="Quantity" text={`${order.quantity}`} />
          </div>
          <div styleName="right">
            <TextWithLabel label="Address" text={order.customer.address} />
            <TextWithLabel
              label="Time"
              text={this.getTimeFromTimestamp(order.date)}
            />
            <TextWithLabel label="Track ID" text={order.trackId} />
            <TextWithLabel label="Subtotal" text={`${order.subtotal} STQ`} />
          </div>
        </div>
        <StatusList items={order.statusHistory} />
      </div>
    );
  }
}

export default Order;
