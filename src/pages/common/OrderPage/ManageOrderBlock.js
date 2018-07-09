// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SpinnerButton } from 'components/common/SpinnerButton';
import { CancelOrderMutation } from 'relay/mutations';

import type {
  MutationParamsType as CancelOrderMutationParamsType,
  CancelOrderMutationResponseType,
} from 'relay/mutations/CancelOrderMutation';

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
};

class ManageOrderBlock extends Component<PropsType, StateType> {
  state: StateType = {
    isSendInProgress: false,
    isCancelInProgress: false,
  };

  sendOrder = () => {
    this.setState({ isSendInProgress: true });
    setTimeout(() => {
      this.props.onOrderSend(true);
      this.setState({ isSendInProgress: false });
    }, 500);
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
        {this.props.isAbleToSend && (
          <div styleName="sendButtonWrapper">
            <SpinnerButton
              big
              isLoading={isSendInProgress}
              onClick={this.sendOrder}
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
