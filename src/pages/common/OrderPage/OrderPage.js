// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { pathOr, filter, prop, propEq, head, map, slice, sort } from 'ramda';
import moment from 'moment';
import { withRouter, routerShape } from 'found';

import { Button } from 'components/common/Button';

import {
  timeFromTimestamp,
  fullDateFromTimestamp,
  shortDateFromTimestamp,
} from 'utils/formatDate';
import { withShowAlert } from 'components/App/AlertContext';

import type { ProductDTOType } from 'pages/common/OrderPage/ProductBlock';
import type { OrderStatusType } from 'pages/common/OrderPage/StatusList';
import type { AddAlertInputType } from 'components/App/AlertContext';

import TextWithLabel from './TextWithLabel';
import ProductBlock from './ProductBlock';
import StatusList from './StatusList';
import ManageOrderBlock from './ManageOrderBlock';
import { getStatusStringFromEnum } from './utils';

import './OrderPage.scss';

type PropsType = {
  order: any, // TODO: use common type here.
  showAlert: (input: AddAlertInputType) => void,
  isAbleToManageOrder?: boolean,
  router: routerShape,
};

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
  transactionInfo?: {
    wallet: string,
    amount: number,
    reservedDueDate: string,
    transactionId: ?string,
    status: string,
    ordersInInvoice: number,
  },
};

class OrderPage extends PureComponent<PropsType> {
  getDateFromTimestamp = (timestamp: string): string =>
    fullDateFromTimestamp(timestamp);

  getTimeFromTimestamp = (timestamp: string): string =>
    timeFromTimestamp(timestamp);

  getOrderDTO = (order: any): OrderDTOType => {
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
            // $FlowIgnoreMe
            head(
              filter(
                propEq('lang', 'EN'),
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
          status: getStatusStringFromEnum(historyEdge.node.state),
          additionalInfo: historyEdge.node.comment,
        };
      }, order && order.history ? sort((a, b) => moment(a.node.committedAt).isBefore(b.node.committedAt), order.history.edges) : []),
      transactionInfo: {
        wallet: '0x0702dfed3d8b0bb356afccf2bd59ba4fb7a3f1a0',
        amount: 123321,
        reservedDueDate: moment()
          .utc()
          .add(20, 'm')
          .format(),
        transactionId: null,
        status: 'asdf',
        ordersInInvoice: 3,
      },
    };
    return orderDTO;
  };

  handleOrderSent = (success: boolean) => {
    if (success) {
      this.props.showAlert({
        type: 'success',
        text: 'Order was successfully sent.',
        link: {
          text: 'Ok',
        },
      });
    } else {
      this.props.showAlert({
        type: 'danger',
        text: 'Something is going wrong :(',
        link: {
          text: 'Ok',
        },
      });
    }
  };

  handleOrderCanceled = (success: boolean) => {
    if (success) {
      this.props.showAlert({
        type: 'success',
        text: 'Order successfully canceled.',
        link: {
          text: 'Ok',
        },
      });
    } else {
      this.props.showAlert({
        type: 'danger',
        text: 'Something is going wrong :(',
        link: {
          text: 'Ok',
        },
      });
    }
  };

  render() {
    const { order: orderFromProps } = this.props;
    const order: OrderDTOType = this.getOrderDTO(orderFromProps);
    return (
      <div styleName="container">
        <div styleName="mainBlock">
          <div styleName="orderNumber">ORDER #{order.number}</div>
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
            <div>
              <TextWithLabel label="Address" text={order.customer.address} />
              <TextWithLabel
                label="Time"
                text={this.getTimeFromTimestamp(order.date)}
              />
              <TextWithLabel label="Track ID" text={order.trackId} />
              <TextWithLabel label="Subtotal" text={`${order.subtotal} STQ`} />
            </div>
          </div>
          {this.props.isAbleToManageOrder && (
            <ManageOrderBlock
              isAbleToSend={orderFromProps.state === 'IN_PROCESSING'}
              isAbleToCancel={
                orderFromProps.state === 'PAIMENT_AWAITED' ||
                orderFromProps.state === 'IN_PROCESSING'
              }
              orderSlug={parseInt(order.number, 10)}
              onOrderSend={this.handleOrderSent}
              onOrderCancel={this.handleOrderCanceled}
            />
          )}
          <StatusList items={order.statusHistory} />
        </div>
        <div styleName="statusBlock">
          <div styleName="title">Order status info</div>
          <div styleName="statusTitle">Status</div>
          <div styleName="statusInfo">
            {getStatusStringFromEnum(order.status)}
          </div>
          <div styleName="statusTitle">Payment status</div>
          <div
            styleName={classNames('statusInfo', {
              paid: order.paymentStatus === 'Paid',
              unpaid: order.paymentStatus !== 'Paid',
            })}
          >
            {order.paymentStatus}
          </div>
          {order.status !== 'Not paid' && (
            <div styleName="paymentButtonWrapper">
              <Button
                big
                onClick={() => {
                  this.props.router.push(
                    `/profile/orders/${order.number}/payment-info`,
                  );
                }}
              >
                Payment info
              </Button>
            </div>
          )}
          <div styleName="ticketButtonTitle">Having troubles?</div>
          <div styleName="ticketButtonWrapper">
            <Button big>Open ticket</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withShowAlert(withRouter(OrderPage));
