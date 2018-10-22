// @flow

import React, { Component } from 'react';
import { pathOr, isNil } from 'ramda';
import { Environment } from 'relay-runtime';

import { Input } from 'components/common/Input';
import { Button } from 'components/common/Button';
import { Modal } from 'components/Modal';
import { CancelOrderMutation, SendOrderMutation } from 'relay/mutations';

import type {
  MutationParamsType as CancelOrderMutationParamsType,
  CancelOrderMutationResponseType,
} from 'relay/mutations/CancelOrderMutation';

import type {
  MutationParamsType as SendOrderMutationParamsType,
  SendOrderMutationResponseType,
} from 'relay/mutations/SendOrderMutation';

import './ManageOrderBlock.scss';

import t from './i18n';

type PropsType = {
  environment: Environment,
  isAbleToSend: boolean,
  isAbleToCancel: boolean,
  onOrderSend: (success: boolean) => void,
  onOrderCancel: (success: boolean) => void,
  orderSlug: number,
};

type StateType = {
  isSendInProgress: boolean,
  isCancelInProgress: boolean,
  isSendOrderModalShown: boolean,
  trackNumber: ?string,
  comment: ?string,
};

class ManageOrderBlock extends Component<PropsType, StateType> {
  state: StateType = {
    isSendInProgress: false,
    isCancelInProgress: false,
    isSendOrderModalShown: false,
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

  sendOrder = () => {
    this.setState({ isSendInProgress: true });
    const params: SendOrderMutationParamsType = {
      input: {
        clientMutationId: '',
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

  cancelOrder = () => {
    // eslint-disable-next-line
    const isConfirmed = confirm(t.areYouSureToCancelOrder);
    if (!isConfirmed) {
      return;
    }

    this.setState({ isCancelInProgress: true });
    const params: CancelOrderMutationParamsType = {
      environment: this.context.environment,
      input: {
        clientMutationId: '',
        orderSlug: this.props.orderSlug,
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

  render() {
    const { isSendInProgress, isCancelInProgress } = this.state;
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
        {this.props.isAbleToSend && (
          <div styleName="sendButtonWrapper">
            <Button
              big
              onClick={() => this.setState({ isSendOrderModalShown: true })}
            >
              {t.sendNow}
            </Button>
          </div>
        )}
        {this.props.isAbleToCancel && (
          <div styleName="cancelButtonWrapper">
            <Button
              wireframe
              big
              isLoading={isCancelInProgress}
              onClick={this.cancelOrder}
            >
              {t.cancelOrder}
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default ManageOrderBlock;
