// @flow

import React, { PureComponent } from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import { matchShape, withRouter } from 'found';
import { pathOr, filter, prop, propEq, head } from 'ramda';
import classNames from 'classnames';

import { Button } from 'components/common/Button';
import { timeFromTimestamp, fullDateFromTimestamp } from 'utils/formatDate';

import TextWithLabel from './TextWithLabel';
import ProductBlock from './ProductBlock';
import StatusList from './StatusList';

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
  data: {
    order: {
      [string]: any,
    },
  },
  relay: {
    refetch: Function,
  },
  match: matchShape,
};

class Order extends PureComponent<PropsType> {
  componentDidMount() {
    const orderId = pathOr(0, ['params', 'orderId'], this.props.match);
    this.props.relay.refetch(
      {
        slug: parseInt(orderId, 10),
      },
      null,
      () => {},
      { force: true },
    );
  }

  getOrderDTO = (): ?OrderDTOType => {
    const { order } = this.props.data;

    if (!order) {
      return null;
    }

    const orderDTO: OrderDTOType = {
      number: order.slug,
      product: {
        id: `${order.product.baseProduct.rawId}`,
        storeId: order.storeId,
        // $FlowIgnoreMe
        name: pathOr('', ['name', 0, 'text'], order.product.baseProduct),
        photoUrl: order.product.photoMain,
        category: {
          id: order.product.baseProduct.category.rawId,
          // $FlowIgnoreMe
          name: prop(
            'text',
            head(
              filter(
                propEq('lang', 'EN'),
                order.product.baseProduct.category.name,
              ),
            ),
          ),
        },
        price: order.product.price,
        attributes: [],
      },
      customer: {
        name: order.receiverName,
        address: order.addressFull.value || '-',
      },
      date: order.createdAt,
      delivery: order.deliveryCompany || '-',
      trackId: order.trackId || '-',
      quantity: order.quantity,
      subtotal: order.subtotal,
      status: order.state,
      paymentStatus: order.paymentStatus ? 'Paid' : 'Not paid',
      statusHistory: [],
    };
    return orderDTO;
  };

  getDateFromTimestamp = (timestamp: string): string =>
    fullDateFromTimestamp(timestamp);

  getTimeFromTimestamp = (timestamp: string): string =>
    timeFromTimestamp(timestamp);

  render() {
    const order = this.getOrderDTO();

    if (!order) {
      return null;
    }

    return (
      <div styleName="container">
        <div styleName="orderNumber">ORDER #{order.number}</div>
        <div styleName="statusBlock">
          <div styleName="statuses">
            <div styleName="statusTitle">Status</div>
            <div styleName="statusInfo">{order.status}</div>
            <div styleName="statusTitle secondStatusTitle">Payment status</div>
            <div
              styleName={classNames('statusInfo', {
                paid: order.paymentStatus === 'Paid',
                unpaid: order.paymentStatus !== 'Paid',
              })}
            >
              {order.paymentStatus}
            </div>
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

export default createRefetchContainer(
  withRouter(Order),
  graphql`
    fragment Order on User
      @argumentDefinitions(slug: { type: "Int!", defaultValue: 0 }) {
      order(slug: $slug) {
        slug
        storeId
        product {
          baseProduct {
            rawId
            name {
              text
            }
            category {
              rawId
              name {
                text
                lang
              }
            }
          }
          price
          attributes {
            value
            attribute {
              name {
                lang
                text
              }
            }
          }
          photoMain
        }
        receiverName
        addressFull {
          value
        }
        createdAt
        deliveryCompany
        trackId
        quantity
        subtotal
        state
        paymentStatus
      }
    }
  `,
  graphql`
    query Order_Query($slug: Int!) {
      me {
        ...Order @arguments(slug: $slug)
      }
    }
  `,
);
