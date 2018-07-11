// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Input } from 'components/common/Input';
import { SpinnerButton } from 'components/common/SpinnerButton';
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

type PropsType = {
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

  handleTrackIdChanged = (e: { target: { value: string } }) => {
    this.setState({ trackNumber: e.target.value });
  };

  handleCommentChanged = (e: { target: { value: string } }) => {
    this.setState({ comment: e.target.value });
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
      environment: this.context.environment,
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
    const isConfirmed = confirm('Are you sure to cancel order?');
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
              Send your product<br />to customer
            </div>
            <div styleName="description">
              Do not forget to attach track number you get from delivery service
              used for product sending
            </div>
            <div styleName="inputWrapperTrackId">
              <Input
                fullWidth
                id="send-order-modal-trackId"
                label="Track number"
                onChange={this.handleTrackIdChanged}
                value={this.state.trackNumber}
                limit={50}
              />
            </div>
            <div styleName="inputWrapperComment">
              <Input
                fullWidth
                id="send-order-modal-comment"
                label="Comment"
                onChange={this.handleCommentChanged}
                value={this.state.comment}
                limit={100}
              />
            </div>
            <div styleName="sendOrderButtonWrapper">
              <SpinnerButton
                big
                isLoading={isSendInProgress}
                onClick={this.sendOrder}
              >
                Send order
              </SpinnerButton>
            </div>
          </div>
        </Modal>
        {this.props.isAbleToSend && (
          <div styleName="sendButtonWrapper">
            <SpinnerButton
              big
              onClick={() => this.setState({ isSendOrderModalShown: true })}
            >
              Send now
            </SpinnerButton>
          </div>
        )}
        {this.props.isAbleToCancel && (
          <div styleName="cancelButtonWrapper">
            <SpinnerButton
              white
              big
              isLoading={isCancelInProgress}
              onClick={this.cancelOrder}
            >
              Cancel order
            </SpinnerButton>
          </div>
        )}
      </div>
    );
  }
}

ManageOrderBlock.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default ManageOrderBlock;
