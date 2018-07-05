// @flow

import React, { PureComponent } from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import { matchShape, withRouter } from 'found';
import { pathOr, filter, prop, propEq, head, map, slice } from 'ramda';
import classNames from 'classnames';

import { Button } from 'components/common/Button';
import {
  timeFromTimestamp,
  fullDateFromTimestamp,
  shortDateFromTimestamp,
} from 'utils/formatDate';

import TextWithLabel from './TextWithLabel';
import ProductBlock from './ProductBlock';
import StatusList from './StatusList';

import type { ProductDTOType } from './ProductBlock';
import type { OrderStatusType } from './StatusList';
import type { Order as OrderType } from './__generated__/Order.graphql';

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
  data: OrderType,
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
      number: `${order.slug}`,
      product: {
        id: `${
          order.product && order.product.baseProduct
            ? order.product.baseProduct.rawId
            : 0
        }`,
        storeId: order.storeId,
        // $FlowIgnoreMe
        name: pathOr('', ['name', 0, 'text'], order.product.baseProduct),
        photoUrl: order.product && order.product.photoMain,
        category: {
          // $FlowIgnoreMe
          id: `${pathOr(
            0,
            ['product', 'baseProduct', 'category', 'rawId'],
            order,
          )}`,
          name: prop(
            'text',
            head(
              filter(
                propEq('lang', 'EN'),
                // $FlowIgnoreMe
                pathOr(
                  [],
                  ['product', 'baseProduct', 'category', 'name'],
                  order,
                ),
              ),
            ),
          ),
        },
        price: order.product ? order.product.price : -1,
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
      // $FlowIgnoreMe
      statusHistory: map(historyEdge => {
        let manager = '';
        if (historyEdge.node.user) {
          if (historyEdge.node.user.lastName) {
            manager = historyEdge.node.user.lastName;
            if (historyEdge.node.user.firstName) {
              manager = `${manager} ${slice(
                0,
                1,
                historyEdge.node.user.firstName,
              )}.`;
            }
          }
        }
        return {
          date: `${shortDateFromTimestamp(
            historyEdge.node.committedAt,
          )}\n${timeFromTimestamp(historyEdge.node.committedAt)}`,
          manager,
          status: this.getStatusString(historyEdge.node.state),
          additionalInfo: historyEdge.node.comment,
        };
      }, order && order.history ? order.history.edges : []),
    };
    return orderDTO;
  };

  getStatusString = (orderStatus: string): string => {
    switch (orderStatus) {
      case 'CANCELLED':
        return 'Cancelled';
      case 'COMPLETE':
        return 'Completed';
      case 'DELIVERED':
        return 'Delivered';
      case 'IN_PROCESSING':
        return 'In process';
      case 'PAID':
        return 'Paid';
      case 'PAIMENT_AWAITED':
        return 'Wait for payment';
      case 'RECEIVED':
        return 'Received';
      case 'SENT':
        return 'Sent';
      default:
        return 'Undefined';
    }
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
            <div styleName="statusInfo">
              {this.getStatusString(order.status)}
            </div>
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
        history {
          edges {
            node {
              state
              committedAt
              user {
                firstName
                lastName
              }
              comment
            }
          }
        }
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
