// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import { pathOr, filter, prop, propEq, head, map, slice, sort } from 'ramda';
import moment from 'moment';

import { Button } from 'components/common/Button';
import { PaymentPopup } from 'pages/common/PaymentPopup';

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

type StateType = {
  isPaymentInfoPopupShown: boolean,
};

class OrderPage extends Component<PropsType, StateType> {
  state: StateType = {
    isPaymentInfoPopupShown: false,
  };

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

  showPaymentInfoPopup = () => {
    this.setState({ isPaymentInfoPopupShown: true });
  };

  render() {
    const { order: orderFromProps } = this.props;
    const order: OrderDTOType = this.getOrderDTO(orderFromProps);
    return (
      <div styleName="container">
        {order.transactionInfo &&
          this.state.isPaymentInfoPopupShown && (
            <PaymentPopup
              isShown={this.state.isPaymentInfoPopupShown}
              onCloseClicked={() =>
                this.setState({ isPaymentInfoPopupShown: false })
              }
              walletAddress={order.transactionInfo.wallet}
              amount={order.transactionInfo.amount}
              reservedDueDate={order.transactionInfo.reservedDueDate}
            />
          )}
        <div styleName="orderNumber">ORDER #{order.number}</div>
        <div styleName="statusBlock">
          <div styleName="statuses">
            <div styleName="statusTitle">Status</div>
            <div styleName="statusInfo">
              {getStatusStringFromEnum(order.status)}
            </div>
            <div styleName="statusTitle secondStatusTitle">Payment status</div>
            <div
              styleName={classNames('statusInfo', {
                paid: order.paymentStatus === 'Paid',
                unpaid: order.paymentStatus !== 'Paid',
              })}
            />
          </div>
          <div styleName="buttonWrapper">
            <Button wireframe big>
              Open ticket
            </Button>
          </div>
          {order.paymentStatus !== 'Paid' &&
            order.transactionInfo && (
              <div styleName="buttonWrapper">
                <Button wireframe big onClick={this.showPaymentInfoPopup}>
                  Payment info
                </Button>
              </div>
            )}
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
    );
  }
}

export default withShowAlert(OrderPage);
