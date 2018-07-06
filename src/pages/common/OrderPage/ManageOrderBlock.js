// @flow

import React, { Component } from 'react';

import { SpinnerButton } from 'components/common/SpinnerButton';

import './ManageOrderBlock.scss';

type PropsType = {
  isAbleToSend?: boolean,
  isAbleToCancel?: boolean,
  onOrderSend?: () => void,
  onOrderCancel?: () => void,
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
  };

  cancelOrder = () => {
    this.setState({ isCancelInProgress: true });
  };

  render() {
    const { isSendInProgress, isCancelInProgress } = this.state;
    return (
      <div styleName="container">
        {this.props.isAbleToSend && (
          <SpinnerButton
            big
            isLoading={isSendInProgress}
            onClick={this.sendOrder}
          >
            Send now
          </SpinnerButton>
        )}
        {this.props.isAbleToCancel && (
          <SpinnerButton
            white
            big
            isLoading={isCancelInProgress}
            onClick={this.cancelOrder}
          >
            Cancel order
          </SpinnerButton>
        )}
      </div>
    );
  }
}

export default ManageOrderBlock;
