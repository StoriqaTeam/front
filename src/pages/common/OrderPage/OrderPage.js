// @flow

import React, { PureComponent } from 'react';
import { pathOr, filter, prop, propEq, head, map, slice, sort } from 'ramda';
import moment from 'moment';
import { withRouter, routerShape } from 'found';

import { Button } from 'components/common/Button';
import { Row, Col } from 'layout';

import {
  stringFromTimestamp,
  timeFromTimestamp,
  fullDateFromTimestamp,
  shortDateFromTimestamp,
} from 'utils/formatDate';
import { withShowAlert } from 'components/App/AlertContext';

import type { ProductDTOType } from 'pages/common/OrderPage/ProductBlock';
import type { OrderStatusType } from 'pages/common/OrderPage/StatusList';
import type { AddAlertInputType } from 'components/App/AlertContext';
import { addressToString, formatPrice, getNameText } from 'utils';

import { AppContext } from 'components/App';

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
  customerPhone: ?string,
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
    const { receiverPhone, recieverName } = order;
    const customerName = recieverName || '-';
    const customerAddress = addressToString(order.addressFull) || '—';
    // const customerPhone = customer.phone || null; // is replaced by: order.receiverPhone
    const attributes = map(
      item => ({
        name: getNameText(pathOr([], ['attribute', 'name'], item), 'EN') || '',
        value: item.value,
      }),
      pathOr([], ['product', 'attributes'], order),
    );
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
        name: pathOr(null, ['baseProduct', 'name', 0, 'text'], order.product),
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
        // $FlowIgnore
        attributes,
        preOrder: order.preOrder,
        preOrderDays: order.preOrderDays,
      },
      customerName,
      customerAddress,
      customerPhone: receiverPhone,
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

  handleOrderSent = (success: boolean): void => {
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

  handleOrderCanceled = (success: boolean): void => {
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
      <AppContext>
        {({ environment }) => (
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
              {order.product.name ? (
                <ProductBlock product={order.product} />
              ) : (
                <div styleName="noProduct">The product was deleted</div>
              )}
              {order.product &&
                order.product.preOrder &&
                order.product.preOrderDays && (
                  <div styleName="preOrder">
                    <div styleName="preOrderText">
                      <div>This product was bought on pre-order.</div>
                      <div>
                        Lead time (days):{' '}
                        <span styleName="preOrderDays">
                          {order.product.preOrderDays}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              <div styleName="infoBlock">
                <div styleName="infoBlockItem">
                  <Row>
                    <Col size={12} lg={5}>
                      <TextWithLabel
                        label="Customer"
                        text={order.customerName}
                      />
                    </Col>
                    <Col size={12} lg={7}>
                      <TextWithLabel
                        label="Contacts"
                        text={`${order.customerAddress}${
                          order.customerPhone ? `, ${order.customerPhone}` : ''
                        }`}
                      />
                    </Col>
                  </Row>
                </div>
                <div styleName="infoBlockItem">
                  <Row>
                    <Col size={12} lg={5}>
                      <TextWithLabel
                        label="Date"
                        text={stringFromTimestamp({
                          timestamp: order.date,
                          format: 'DD MMMM YYYY',
                        })}
                      />
                    </Col>
                    <Col size={12} lg={7}>
                      <TextWithLabel
                        label="Time"
                        text={stringFromTimestamp({
                          timestamp: order.date,
                          format: 'HH:mm',
                        })}
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
                      <TextWithLabel
                        label="Quantity"
                        text={`${order.quantity}`}
                      />
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
                orderFromProps.state === 'PAID' && (
                  <div styleName="manageBlock">
                    <ManageOrderBlock
                      environment={environment}
                      isAbleToSend={orderFromProps.state === 'PAID'}
                      isAbleToCancel={false}
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
        )}
      </AppContext>
    );
  }
}

export default withShowAlert(withRouter(OrderPage));
