// @flow

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { pathOr, isNil } from 'ramda';
import { Environment } from 'relay-runtime';
import uuidv4 from 'uuid/v4';

import { Input } from 'components/common/Input';
import { Button } from 'components/common/Button';
import { Modal } from 'components/Modal';
import { Confirmation } from 'components/Confirmation';
import { Row, Col } from 'layout';
import { formatPrice } from 'utils';
import {
  CancelOrderMutation,
  SendOrderMutation,
  ConfirmOrderMutation,
  ChargeFeeMutation,
} from 'relay/mutations';

import type { AllCurrenciesType, OrderBillingStatusesType } from 'types';
import type {
  MutationParamsType as CancelOrderMutationParamsType,
  CancelOrderMutationResponseType,
} from 'relay/mutations/CancelOrderMutation';

import type {
  MutationParamsType as SendOrderMutationParamsType,
  SendOrderMutationResponseType,
} from 'relay/mutations/SendOrderMutation';

import type {
  MutationParamsType as ConfirmOrderMutationParamsType,
  ConfirmOrderMutationResponseType,
} from 'relay/mutations/ConfirmOrderMutation';

import type {
  MutationParamsType as ChargeFeeMutationParamsType,
  ChargeFeeMutationResponseType,
} from 'relay/mutations/ChargeFeeMutation';

import TextWithLabel from '../TextWithLabel';
import { getStatusStringFromEnum } from '../utils';

import './ManageOrderBlock.scss';

import t from './i18n';

type PropsType = {
  environment: Environment,
  isAbleToSend: boolean,
  // isAbleToCancel: boolean,
  isAbleToConfirm: boolean,
  onOrderSend: (success: boolean) => void,
  onOrderConfirm: (success: boolean) => void,
  onOrderCancel: (success: boolean) => void,
  onChargeFee: (success: boolean) => void,
  orderSlug: number,
  orderFee: ?{
    id: string,
    orderId: string,
    amount: number,
    status: string,
    currency: AllCurrenciesType,
    chargeId: string,
  },
  orderId: string,
  orderBilling: ?{
    id: string,
    state: OrderBillingStatusesType,
    stripeFee: number,
    sellerCurrency: AllCurrenciesType,
  },
};

type StateType = {
  isSendInProgress: boolean,
  isCancelInProgress: boolean,
  isChargeFeeInProgress: boolean,
  isSendOrderModalShown: boolean,
  isCancelOrderModalShown: boolean,
  isChargeFeeModalShown: boolean,
  trackNumber: ?string,
  comment: ?string,
};

class ManageOrderBlock extends Component<PropsType, StateType> {
  state: StateType = {
    isSendInProgress: false,
    isCancelInProgress: false,
    isChargeFeeInProgress: false,
    isSendOrderModalShown: false,
    isCancelOrderModalShown: false,
    isChargeFeeModalShown: false,
    trackNumber: null,
    comment: null,
  };

  handleTrackIdChanged = (e: ?SyntheticInputEvent<HTMLInputElement>) => {
    if (!isNil(e)) {
      const value = pathOr(null, ['target', 'value'], e);
      this.setState({ trackNumber: value });
    }
  };

  handleCommentChanged = (e: ?SyntheticInputEvent<HTMLInputElement>) => {
    if (!isNil(e)) {
      const value = pathOr(null, ['target', 'value'], e);
      this.setState({ comment: value });
    }
  };

  handleSendOrderModalClose = () => {
    this.setState({ isSendOrderModalShown: false });
  };

  handleCancelOrderModalClose = () => {
    this.setState({ isCancelOrderModalShown: false });
  };

  handleChargeFeeModalClose = () => {
    this.setState({ isChargeFeeModalShown: false });
  };

  sendOrder = () => {
    this.setState({ isSendInProgress: true });
    const params: SendOrderMutationParamsType = {
      input: {
        clientMutationId: uuidv4(),
        orderSlug: this.props.orderSlug,
        trackId: this.state.trackNumber,
        comment: this.state.comment,
      },
      environment: this.props.environment,
      onCompleted: (
        response: ?SendOrderMutationResponseType,
        errors: ?Array<Error>,
      ) => {
        this.setState({
          isSendInProgress: false,
          isSendOrderModalShown: false,
        });
        this.props.onOrderSend(!errors);
      },
      onError: () => {
        this.setState({ isSendInProgress: false });
        this.props.onOrderSend(false);
      },
    };
    SendOrderMutation.commit(params);
  };

  confirmOrder = () => {
    this.setState({ isSendInProgress: true });
    const params: ConfirmOrderMutationParamsType = {
      input: {
        clientMutationId: uuidv4(),
        orderSlug: this.props.orderSlug,
      },
      environment: this.props.environment,
      onCompleted: (
        response: ?ConfirmOrderMutationResponseType,
        errors: ?Array<Error>,
      ) => {
        this.setState({ isSendInProgress: false });
        this.props.onOrderConfirm(!errors);
      },
      onError: () => {
        this.setState({ isSendInProgress: false });
        this.props.onOrderConfirm(false);
      },
    };
    ConfirmOrderMutation.commit(params);
  };

  cancelOrder = () => {
    this.setState({
      isCancelInProgress: true,
      isCancelOrderModalShown: false,
    });
    const params: CancelOrderMutationParamsType = {
      environment: this.props.environment,
      input: {
        clientMutationId: uuidv4(),
        orderSlug: this.props.orderSlug,
        committerRole: 'SELLER',
      },
      onCompleted: (
        response: ?CancelOrderMutationResponseType,
        errors: ?Array<Error>,
      ) => {
        this.setState({ isCancelInProgress: false });
        this.props.onOrderCancel(!errors);
      },
      onError: () => {
        this.setState({ isCancelInProgress: false });
        this.props.onOrderCancel(false);
      },
    };
    CancelOrderMutation.commit(params);
  };

  chargeFee = () => {
    this.setState({
      isChargeFeeInProgress: true,
      isChargeFeeModalShown: false,
    });
    const params: ChargeFeeMutationParamsType = {
      environment: this.props.environment,
      input: {
        clientMutationId: uuidv4(),
        orderId: this.props.orderId,
      },
      onCompleted: (
        response: ?ChargeFeeMutationResponseType,
        errors: ?Array<Error>,
      ) => {
        this.setState({ isChargeFeeInProgress: false });
        this.props.onChargeFee(!errors);
      },
      onError: () => {
        this.setState({ isCancelInProgress: false });
        this.props.onChargeFee(false);
      },
    };
    ChargeFeeMutation.commit(params);
  };

  render() {
    const {
      orderFee,
      isAbleToSend,
      isAbleToConfirm,
      orderBilling,
    } = this.props;

    const {
      isSendInProgress,
      isCancelInProgress,
      isCancelOrderModalShown,
      isChargeFeeModalShown,
      isChargeFeeInProgress,
    } = this.state;
    return (
      <div styleName="container">
        <Modal
          showModal={this.state.isSendOrderModalShown}
          onClose={this.handleSendOrderModalClose}
        >
          <div styleName="sendOrderModal">
            <div styleName="title">
              {t.sendYourProduct}
              <br />
              {t.toCustomer}
            </div>
            <div styleName="description">{t.doNotForgetToAttach}</div>
            <div styleName="inputWrapperTrackId">
              <Input
                fullWidth
                id="send-order-modal-trackId"
                label={t.labelTrackNumber}
                onChange={this.handleTrackIdChanged}
                value={this.state.trackNumber || ''}
                limit={50}
              />
            </div>
            <div styleName="inputWrapperComment">
              <Input
                fullWidth
                id="send-order-modal-comment"
                label={t.labelComment}
                onChange={this.handleCommentChanged}
                value={this.state.comment || ''}
                limit={100}
              />
            </div>
            <div styleName="sendOrderButtonWrapper">
              <Button big isLoading={isSendInProgress} onClick={this.sendOrder}>
                {t.sendOrder}
              </Button>
            </div>
          </div>
        </Modal>
        <Confirmation
          showModal={isCancelOrderModalShown}
          onClose={this.handleCancelOrderModalClose}
          title={t.cancelOrderTitle}
          description={t.cancelOrderDescription}
          onCancel={this.handleCancelOrderModalClose}
          onConfirm={this.cancelOrder}
          confirmText={t.cancelOrderConfirmText}
          cancelText={t.cancelOrderCancelText}
        />
        {(isAbleToSend || isAbleToConfirm) && (
          <Fragment>
            <div styleName="title">
              <strong>{t.manage}</strong>
            </div>
            <div styleName="buttons">
              {isAbleToSend && (
                <div styleName="sendButtonWrapper">
                  <Button
                    big
                    onClick={() =>
                      this.setState({ isSendOrderModalShown: true })
                    }
                  >
                    {t.sendNow}
                  </Button>
                </div>
              )}
              {isAbleToConfirm && (
                <div styleName="sendButtonWrapper">
                  <Button
                    big
                    onClick={this.confirmOrder}
                    isLoading={isSendInProgress}
                  >
                    {t.confirmOrder}
                  </Button>
                </div>
              )}
              {isAbleToConfirm && (
                <div styleName="cancelButtonWrapper">
                  <Button
                    wireframe
                    big
                    isLoading={isCancelInProgress}
                    onClick={() => {
                      this.setState({ isCancelOrderModalShown: true });
                    }}
                  >
                    {t.cancelOrder}
                  </Button>
                </div>
              )}
            </div>
          </Fragment>
        )}
        {orderFee && (
          <div
            styleName={classNames('orderFee', {
              alone: !isAbleToSend && !isAbleToConfirm,
            })}
          >
            <Confirmation
              showModal={isChargeFeeModalShown}
              onClose={this.handleChargeFeeModalClose}
              title={t.areYouSureToPayChargeFee}
              description={t.pleaseCheckCard}
              onCancel={this.handleChargeFeeModalClose}
              onConfirm={this.chargeFee}
              confirmText={t.payFee}
              cancelText={t.cancel}
            />
            <div styleName="title">
              <strong>{t.chargeFee}</strong>
            </div>
            <div styleName="desc">
              <div styleName="infoBlockItem">
                <Row>
                  <Col size={12} lg={5}>
                    <TextWithLabel
                      label={t.storiqaFee}
                      text={`${formatPrice(orderFee.amount)} ${
                        orderFee.currency
                      }`}
                    />
                  </Col>
                  <Col size={12} lg={7}>
                    <TextWithLabel
                      label={t.status}
                      text={getStatusStringFromEnum(orderFee.status)}
                    />
                  </Col>
                </Row>
              </div>
              {orderBilling &&
                orderBilling.stripeFee && (
                  <div styleName="infoBlockItem">
                    <Row>
                      <Col size={12} lg={5}>
                        <TextWithLabel
                          label={t.bankTransactionFee}
                          text={`${formatPrice(orderBilling.stripeFee)} ${
                            orderBilling.sellerCurrency
                          }`}
                        />
                      </Col>
                    </Row>
                  </div>
                )}
            </div>
            {orderFee.status === 'NOT_PAID' && (
              <div styleName="cancelButtonWrapper">
                <Button
                  big
                  isLoading={isChargeFeeInProgress}
                  onClick={() => {
                    this.setState({ isChargeFeeModalShown: true });
                  }}
                >
                  {t.payFee}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default ManageOrderBlock;
