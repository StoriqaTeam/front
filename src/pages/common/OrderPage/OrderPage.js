// @flow

import React, { Component } from 'react';
import { pathOr, filter, prop, propEq, head, map, sort } from 'ramda';
import moment from 'moment';
import { withRouter, routerShape, matchShape } from 'found';

import { Modal } from 'components/Modal';
import { Button } from 'components/common/Button';
import { Row, Col } from 'layout';

import {
  stringFromTimestamp,
  timeFromTimestamp,
  fullDateFromTimestamp,
  shortDateFromTimestamp,
} from 'utils/formatDate';
import { withShowAlert } from 'components/Alerts/AlertContext';

import type { ProductDTOType } from 'pages/common/OrderPage/ProductBlock';
import type { OrderStatusType } from 'pages/common/OrderPage/StatusList';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import { addressToString, formatPrice, getNameText } from 'utils';

import { AppContext } from 'components/App';

import type { OrderBillingStatusesType } from 'types';

import TextWithLabel from './TextWithLabel';
import ProductBlock from './ProductBlock';
import StatusList from './StatusList';
import ManageOrderBlock from './ManageOrderBlock';
import ManageOrderBlockForUser from './ManageOrderBlockForUser';
import OpenTicketModal from './OpenTicketModal';
import { getStatusStringFromEnum } from './utils';

import './OrderPage.scss';

import t from './i18n';

type StateType = {
  isOpenTicketModalShown: boolean,
};

type PropsType = {
  order: any, // TODO: use common type here.
  showAlert: (input: AddAlertInputType) => void,
  isAbleToManageOrder?: boolean,
  isAbleToManageOrderForUser?: boolean,
  isPaymentInfoCanBeShown?: boolean,
  router: routerShape,
  match: matchShape,
  email: string,
  showInvoice: boolean,
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
  totalAmount: number,
  status: string,
  paymentStatus: string,
  statusHistory: Array<OrderStatusType>,
  customerName: string,
  customerAddress: string,
  deliveryPrice: number,
  couponPrice: ?number,
  currency: string,
  billingStatus: ?OrderBillingStatusesType,
};

class OrderPage extends Component<PropsType, StateType> {
  static defaultProps = {
    showInvoice: false,
  };

  state = {
    isOpenTicketModalShown: false,
  };

  getDateFromTimestamp = (timestamp: string): string =>
    fullDateFromTimestamp(timestamp);

  getTimeFromTimestamp = (timestamp: string): string =>
    timeFromTimestamp(timestamp);

  getOrderDTO = (order: any): OrderDTOType => {
    const { receiverPhone, receiverName } = order;
    const customerName = receiverName || '-';
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
      totalAmount: order.totalAmount,
      deliveryPrice: order.deliveryPrice,
      couponPrice: order.couponDiscount,
      currency: order.currency,
      status: order.state,
      paymentStatus: order.paymentStatus ? t.paid : t.notPaid,
      statusHistory: map(historyEdge => {
        const committer = historyEdge.node.committerRole;
        return {
          date: `${shortDateFromTimestamp(
            historyEdge.node.committedAt,
          )}\n${timeFromTimestamp(historyEdge.node.committedAt)}`,
          committer,
          status: getStatusStringFromEnum(historyEdge.node.state),
          additionalInfo: historyEdge.node.comment,
        };
      }, order && order.history ? sort((a, b) => moment(a.node.committedAt).isBefore(b.node.committedAt), order.history.edges) : []),
      billingStatus:
        order && order.orderBilling ? order.orderBilling.state : null,
    };
    return orderDTO;
  };

  handleOrderSent = (success: boolean): void => {
    if (success) {
      this.props.showAlert({
        type: 'success',
        text: t.orderWasSuccessfullySent,
        link: {
          text: t.ok,
        },
      });
    } else {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingIsGoingWrong,
        link: {
          text: t.ok,
        },
      });
    }
  };

  handleOrderConfirm = (success: boolean): void => {
    if (success) {
      this.props.showAlert({
        type: 'success',
        text: t.orderWasSuccessfullyConfirm,
        link: {
          text: t.ok,
        },
      });
    } else {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingIsGoingWrong,
        link: {
          text: t.ok,
        },
      });
    }
  };

  handleOrderCanceled = (success: boolean): void => {
    if (success) {
      this.props.showAlert({
        type: 'success',
        text: t.orderSuccessfullyCanceled,
        link: {
          text: t.ok,
        },
      });
    } else {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingIsGoingWrong,
        link: {
          text: t.ok,
        },
      });
    }
  };

  handleOrderComplete = (success: boolean): void => {
    if (success) {
      this.props.showAlert({
        type: 'success',
        text: t.orderSuccessfullyComplete,
        link: {
          text: 'Ok',
        },
      });
    } else {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingIsGoingWrong,
        link: {
          text: 'Ok',
        },
      });
    }
  };

  handleChargeFee = (success: boolean): void => {
    if (success) {
      this.props.showAlert({
        type: 'success',
        text: t.chargeFeefullyComplete,
        link: {
          text: 'Ok',
        },
      });
    } else {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingIsGoingWrong,
        link: {
          text: 'Ok',
        },
      });
    }
  };

  invoice = (): void => {
    const {
      match: {
        location: { pathname },
      },
    } = this.props;
    if (process.env.BROWSER) {
      window.open(`${pathname}/invoice`);
    }
  };

  handlerOpenTicket = () => {
    this.setState({ isOpenTicketModalShown: true });
  };

  handleOpenTicketModalClose = () => {
    this.setState({ isOpenTicketModalShown: false });
  };

  render() {
    const {
      order: orderFromProps,
      isPaymentInfoCanBeShown,
      email,
      showAlert,
      showInvoice,
      isAbleToManageOrder,
    } = this.props;
    const { isOpenTicketModalShown } = this.state;
    const order: OrderDTOType = this.getOrderDTO(orderFromProps);
    return (
      <AppContext.Consumer>
        {({ environment }) => (
          <div styleName="container">
            <Modal
              showModal={isOpenTicketModalShown}
              onClose={this.handleOpenTicketModalClose}
            >
              <OpenTicketModal email={email} showAlert={showAlert} />
            </Modal>
            <div styleName="mainBlock">
              <div styleName="orderNumber">
                <strong>
                  {t.order} #{order.number}
                </strong>
              </div>
              <div styleName="statusBlock">
                <div styleName="title">
                  <strong>{t.orderStatusInfo}</strong>
                </div>
                <div styleName="statusPaymentBlock">
                  <div styleName="statusesBlock">
                    <div styleName="statusItem">
                      <div styleName="statusTitle">{t.status}</div>
                      <div styleName="statusInfo">
                        {getStatusStringFromEnum(order.status)}
                      </div>
                    </div>
                  </div>
                  {isAbleToManageOrder &&
                    order.billingStatus && (
                      <div styleName="statusesBlock">
                        <div styleName="statusItem">
                          <div styleName="statusTitle">{t.billingStatus}</div>
                          <div styleName="statusInfo">
                            {order.billingStatus === 'PAID_TO_SELLER'
                              ? t.paid
                              : t.notPaid}
                          </div>
                        </div>
                      </div>
                    )}
                  {isPaymentInfoCanBeShown &&
                    (orderFromProps.state === 'NEW' ||
                      orderFromProps.state === 'PAYMENT_AWAITED' ||
                      orderFromProps.state === 'TRANSACTION_PENDING') && (
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
                          {t.paymentInfo}
                        </Button>
                      </div>
                    )}
                </div>
                <div styleName="ticketButtonTitle">{t.havingTroubles}</div>
                <div styleName="ticketButtonWrapper">
                  <Button
                    big
                    wireframe
                    fullWidth
                    href="https://storiqa.zendesk.com/hc/en-us/requests/new"
                    target="_blank"
                  >
                    {t.openTicket}
                  </Button>
                </div>
                {showInvoice ? (
                  <div styleName="ticketButtonWrapper">
                    <Button big wireframe fullWidth onClick={this.invoice}>
                      {t.invoice}
                    </Button>
                  </div>
                ) : null}
              </div>
              {order.product.name ? (
                <ProductBlock
                  subtotal={order.subtotal}
                  product={order.product}
                  currency={order.currency}
                />
              ) : (
                <div styleName="noProduct">{t.theProductWasDeleted}</div>
              )}
              {order.product &&
                order.product.preOrder &&
                order.product.preOrderDays && (
                  <div styleName="preOrder">
                    <div styleName="preOrderText">
                      <div>{t.thisProductWasBougthOnPreOrder}</div>
                      <div>
                        {t.leadTime}{' '}
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
                        label={t.labelCustomer}
                        text={order.customerName}
                      />
                    </Col>
                    <Col size={12} lg={7}>
                      <TextWithLabel
                        label={t.labelContacts}
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
                        label={t.labelDate}
                        text={stringFromTimestamp({
                          timestamp: order.date,
                          format: 'DD MMMM YYYY',
                        })}
                      />
                    </Col>
                    <Col size={12} lg={7}>
                      <TextWithLabel
                        label={t.labelTime}
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
                      <TextWithLabel
                        label={t.labelDelivery}
                        text={order.delivery}
                      />
                    </Col>
                    <Col size={12} lg={7}>
                      <TextWithLabel
                        label={t.labelDeliveryPrice}
                        text={`${formatPrice(order.deliveryPrice)} ${
                          order.currency
                        }`}
                      />
                    </Col>
                  </Row>
                </div>
                <div styleName="infoBlockItem">
                  <Row>
                    <Col size={12} lg={5}>
                      <TextWithLabel
                        label={t.labelTrackID}
                        text={order.trackId}
                      />
                    </Col>
                    <Col size={12} lg={7}>
                      <TextWithLabel
                        label={t.labelQuantity}
                        text={`${order.quantity}`}
                      />
                    </Col>
                  </Row>
                </div>
                <div styleName="infoBlockItem">
                  <Row>
                    <Col size={12} lg={5}>
                      <TextWithLabel
                        label={t.labelCouponDiscount}
                        text={
                          order.couponPrice
                            ? `−${formatPrice(order.couponPrice)} ${
                                order.currency
                              }`
                            : '—'
                        }
                      />
                    </Col>
                    <Col size={12} lg={7}>
                      <TextWithLabel
                        label={t.labelTotalAmount}
                        text={`${formatPrice(order.totalAmount)} ${
                          order.currency
                        }`}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
              {this.props.isAbleToManageOrder &&
                (orderFromProps.state === 'PAID' ||
                  orderFromProps.state === 'IN_PROCESSING' ||
                  orderFromProps.fee) && (
                  <div styleName="manageBlock">
                    <ManageOrderBlock
                      environment={environment}
                      isAbleToConfirm={orderFromProps.state === 'PAID'}
                      isAbleToSend={orderFromProps.state === 'IN_PROCESSING'}
                      isAbleToCancel={false}
                      orderSlug={parseInt(order.number, 10)}
                      onOrderSend={this.handleOrderSent}
                      onOrderConfirm={this.handleOrderConfirm}
                      onOrderCancel={this.handleOrderCanceled}
                      onChargeFee={this.handleChargeFee}
                      orderFee={orderFromProps.fee || null}
                      orderBilling={orderFromProps.orderBilling || null}
                      orderId={orderFromProps.id}
                    />
                  </div>
                )}
              {this.props.isAbleToManageOrderForUser &&
                orderFromProps.state !== 'COMPLETE' && (
                  <div styleName="manageBlock">
                    <ManageOrderBlockForUser
                      environment={environment}
                      isAbleToSend={
                        orderFromProps.state === 'DELIVERED' ||
                        orderFromProps.state === 'SENT'
                      }
                      orderSlug={parseInt(order.number, 10)}
                      orderId={orderFromProps.id}
                      onOrderComplete={this.handleOrderComplete}
                    />
                  </div>
                )}
              <div styleName="statusList">
                <StatusList items={order.statusHistory} />
              </div>
            </div>
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withShowAlert(withRouter(OrderPage));
