// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import {
  pathOr,
  filter,
  prop,
  propEq,
  head,
  map,
  slice,
  sort,
  values,
  join,
} from 'ramda';
import moment from 'moment';
import { withRouter, routerShape } from 'found';

import { Button } from 'components/common/Button';
import { Row, Col } from 'layout';

import {
  timeFromTimestamp,
  fullDateFromTimestamp,
  shortDateFromTimestamp,
} from 'utils/formatDate';
import { withShowAlert } from 'components/App/AlertContext';

import type { ProductDTOType } from 'pages/common/OrderPage/ProductBlock';
import type { OrderStatusType } from 'pages/common/OrderPage/StatusList';
import type { AddAlertInputType } from 'components/App/AlertContext';
import { addressToString, formatPrice } from 'utils';

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
  isPaymentInfoCanBeShown?: boolean,
  router: routerShape,
};

type OrderDTOType = {
  number: string,
  product: ProductDTOType,
  customerName: string,
  date: string,
  delivery: string,
  trackId: string,
  quantity: number,
  subtotal: number,
  status: string,
  paymentStatus: string,
  statusHistory: Array<OrderStatusType>,
  customerName: string,
  customerAddress: string,
};

class OrderPage extends PureComponent<PropsType> {
  getDateFromTimestamp = (timestamp: string): string =>
    fullDateFromTimestamp(timestamp);

  getTimeFromTimestamp = (timestamp: string): string =>
    timeFromTimestamp(timestamp);

  getOrderDTO = (order: any): OrderDTOType => {
    const { customer } = order;
    const customerDTO = customer
      ? {
          firstName: customer.firstName,
          lastName: customer.lastName,
        }
      : null;
    const customerName =
      customerDTO && (customerDTO.firstName || customerDTO.lastName)
        ? join(' ', filter(item => Boolean(item), values(customerDTO)))
        : '—';
    const customerAddress = addressToString(order.addressFull) || '—';
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
      customerName,
      customerAddress,
      date: order.createdAt,
      delivery: order.deliveryCompany || '—',
      trackId: order.trackId || '—',
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
          <div styleName="orderNumber">
            <strong>ORDER #{order.number}</strong>
          </div>
          <div styleName="statusBlock">
            <div styleName="title">
              <strong>Order status info</strong>
            </div>
            <div styleName="statusPaymentBlock">
              <div styleName="statusesBlock">
                <div styleName="statusItem">
                  <div styleName="statusTitle">Status</div>
                  <div styleName="statusInfo">
                    {getStatusStringFromEnum(order.status)}
                  </div>
                </div>
                <div styleName="statusItem">
                  <div styleName="statusTitle">Payment status</div>
                  <div
                    styleName={classNames('statusInfo', {
                      paid: order.paymentStatus === 'Paid',
                      unpaid: order.paymentStatus !== 'Paid',
                    })}
                  >
                    {order.paymentStatus}
                  </div>
                </div>
              </div>
              {this.props.isPaymentInfoCanBeShown &&
                (orderFromProps.state === 'NEW' ||
                  orderFromProps.state === 'PAYMENT_AWAITED' ||
                  orderFromProps.state === 'TRANSACTION_PENDING' ||
                  orderFromProps.state === 'AMOUNT_EXPIRED') && (
                  <div styleName="paymentButtonWrapper">
                    <Button
                      big
                      fullWidth
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
            </div>
            <div styleName="ticketButtonTitle">Having troubles?</div>
            <div styleName="ticketButtonWrapper">
              <Button big wireframe fullWidth>
                Open ticket
              </Button>
            </div>
          </div>
          <ProductBlock product={order.product} />
          <div styleName="infoBlock">
            <div styleName="infoBlockItem">
              <Row>
                <Col size={12} lg={5}>
                  <TextWithLabel label="Customer" text={order.customerName} />
                </Col>
                <Col size={12} lg={7}>
                  <TextWithLabel label="Address" text={order.customerAddress} />
                </Col>
              </Row>
            </div>
            <div styleName="infoBlockItem">
              <Row>
                <Col size={12} lg={5}>
                  <TextWithLabel
                    label="Date"
                    text={this.getDateFromTimestamp(order.date)}
                  />
                </Col>
                <Col size={12} lg={7}>
                  <TextWithLabel
                    label="Time"
                    text={this.getTimeFromTimestamp(order.date)}
                  />
                </Col>
              </Row>
            </div>
            <div styleName="infoBlockItem">
              <Row>
                <Col size={12} lg={5}>
                  <TextWithLabel label="Delivery" text={order.delivery} />
                </Col>
                <Col size={12} lg={7}>
                  <TextWithLabel label="Track ID" text={order.trackId} />
                </Col>
              </Row>
            </div>
            <div styleName="infoBlockItem">
              <Row>
                <Col size={12} lg={5}>
                  <TextWithLabel label="Quantity" text={`${order.quantity}`} />
                </Col>
                <Col size={12} lg={7}>
                  <TextWithLabel
                    label="Subtotal"
                    text={`${formatPrice(order.subtotal)} STQ`}
                  />
                </Col>
              </Row>
            </div>
          </div>
          {this.props.isAbleToManageOrder &&
            (orderFromProps.state === 'IN_PROCESSING' ||
              orderFromProps.state === 'PAYMENT_AWAITED' ||
              orderFromProps.state === 'IN_PROCESSING') && (
              <div styleName="manageBlock">
                <ManageOrderBlock
                  isAbleToSend={orderFromProps.state === 'IN_PROCESSING'}
                  isAbleToCancel={
                    orderFromProps.state === 'PAYMENT_AWAITED' ||
                    orderFromProps.state === 'IN_PROCESSING'
                  }
                  orderSlug={parseInt(order.number, 10)}
                  onOrderSend={this.handleOrderSent}
                  onOrderCancel={this.handleOrderCanceled}
                />
              </div>
            )}
          <div styleName="statusList">
            <StatusList items={order.statusHistory} />
          </div>
        </div>
      </div>
    );
  }
}

export default withShowAlert(withRouter(OrderPage));
